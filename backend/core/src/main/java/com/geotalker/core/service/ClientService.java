package com.geotalker.core.service;

import com.geotalker.core.api.HtmlApi;
import com.geotalker.core.api.NominatimApi;
import com.geotalker.core.api.TelegramApi;
import com.geotalker.core.dto.client.TelegramMessageDTO;
import com.geotalker.core.dto.client.WiretapDTO;
import com.geotalker.core.dto.client.WiretapDetailsDTO;
import com.geotalker.core.dto.client.form.AddChatForm;
import com.geotalker.core.dto.html.HtmlChatPreview;
import com.geotalker.core.dto.telegram.TFunction.*;
import com.geotalker.core.dto.telegram.TObject.TChat;
import com.geotalker.core.dto.telegram.TObject.TChatInviteLinkInfo;
import com.geotalker.core.dto.telegram.TObject.TChatType.TChatTypeSupergroup;
import com.geotalker.core.dto.telegram.TObject.TChatType.TInviteLinkChatTypeChannel;
import com.geotalker.core.dto.telegram.TObject.TChatType.TInviteLinkChatTypeSupergroup;
import com.geotalker.core.model.*;
import com.geotalker.core.model.enums.WiretapStatus;
import com.geotalker.core.model.locality.Locality;
import com.geotalker.core.model.locality.Osm;
import com.geotalker.core.repository.*;
import com.geotalker.core.util.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static com.geotalker.core.util.ValidationConstants.MINIMUM_MEMBER_COUNT;

@Service
@Transactional
public class ClientService {

    private final TelegramApi telegramApi;
    private final HtmlApi htmlApi;

    private final LocalityService localityService;

    private final HtmlChatPreviewHandler htmlChatPreviewHandler;

    private final WiretapRepository wiretapRepository;
    private final UserAccountRepository userAccountRepository;
    private final TSupergroupRepository tSupergroupRepository;
    private final TelegramMessageRepository telegramMessageRepository;
    private final TelegramMessageMapper telegramMessageMapper;
    private final Integer telegramApiId;


    @Autowired
    public ClientService(TelegramApi telegramApi,
                         HtmlApi htmlApi,
                         HtmlChatPreviewHandler htmlChatPreviewHandler,
                         LocalityService localityService,
                         WiretapRepository wiretapRepository,
                         UserAccountRepository userAccountRepository,
                         TSupergroupRepository tSupergroupRepository,
                         TelegramMessageRepository telegramMessageRepository,
                         TelegramMessageMapper telegramMessageMapper,
                         @Value("${spring.api.telegram.api-id}") Integer telegramApiId) {
        this.telegramApi = telegramApi;
        this.htmlApi = htmlApi;
        this.htmlChatPreviewHandler = htmlChatPreviewHandler;
        this.localityService = localityService;
        this.wiretapRepository = wiretapRepository;
        this.userAccountRepository = userAccountRepository;
        this.tSupergroupRepository = tSupergroupRepository;
        this.telegramMessageRepository = telegramMessageRepository;
        this.telegramMessageMapper = telegramMessageMapper;
        this.telegramApiId = telegramApiId;
    }

    public List<WiretapDTO> getReadyWiretaps(){
        return wiretapRepository.findByStatus(WiretapStatus.READY).stream()
                .map(w -> new WiretapDTO(
                        w.getId(),
                        w.getLocality().getId(),
                        w.getTelegramSupergroup().getProfilePhoto(),
                        w.getTelegramSupergroup().getTitle(),
                        w.getTelegramSupergroup().getMemberCount(),
                        w.getTelegramSupergroup().getIsChannel()))
                .toList();
    }

    public String postNewWiretap(AddChatForm addChatForm, UserAccount userAccount){
        System.out.println(addChatForm);

        Interlink interlink = new Interlink(addChatForm.interlink());

        //check on existing locality. if not create new
        Osm osm = new Osm(new String(addChatForm.osm().substring(0, 1)), Long.parseLong(addChatForm.osm().substring(1)));
        Locality locality = localityService.getOrCreateLocality(osm);




        //Main logic, work with telegramApi
        int apiId = telegramApiId;

        Wiretap wiretap = new Wiretap();
        wiretap.setLocality(locality);
        wiretap.setPrimaryInterlink(interlink.getAsUrl());
        wiretap.setUserAccount(userAccount);





        //TODO checking on existing wiretap where status = waiting and the same interlink
        if(interlink.isHash()){
            TChatInviteLinkInfo tChatInviteLinkInfo = telegramApi.checkChatInviteLink(new TCheckChatInviteLink(interlink.getAsUrl()));
            //TODO //if we get chat_id then we have tChatInviteLinkInfo.memberCount == 0. Need to check by html

            if (!(tChatInviteLinkInfo.type instanceof TInviteLinkChatTypeChannel || tChatInviteLinkInfo.type instanceof TInviteLinkChatTypeSupergroup))  throw new InterlinkNotValidException("ChatType is not InviteLinkChatTypeChannel or InviteLinkChatTypeSupergroup");

            //TODO check by html api
            if (tChatInviteLinkInfo.memberCount != 0 && tChatInviteLinkInfo.memberCount < MINIMUM_MEMBER_COUNT) throw new InterlinkNotValidException("member count of channel/group should be at least " + MINIMUM_MEMBER_COUNT);
            else {
                HtmlChatPreview htmlChatPreview = htmlApi.getTelegramPreview(interlink.getAsUrl());
                if (htmlChatPreview.extra != null) {
                    String type = htmlChatPreviewHandler.extractChatType(htmlChatPreview.extra);
                    int memberCount;
                    if (type.equals("CHANNEL") || type.equals("GROUP")) {
                        memberCount = htmlChatPreviewHandler.extractMembersCount(htmlChatPreview.extra);
                    } else if (type.equals("USER")) {
                        throw new InterlinkNotValidException("username should correspond channel or group, not user");
                    } else throw new RuntimeException("unexpected extra field");

                    if (memberCount < MINIMUM_MEMBER_COUNT) throw new InterlinkNotValidException("member count of channel/group should be at least " + MINIMUM_MEMBER_COUNT);
                }
            }

            try {
                TChat tChat = telegramApi.joinChatByInviteLink(new TJoinChatByInviteLink(interlink.getAsUrl()));

                Optional<TelegramSupergroup> optionalTSupergroup = tSupergroupRepository.findById(new TelegramSupergroup.PK(((TChatTypeSupergroup) tChat.type).supergroupId, apiId));
                if (optionalTSupergroup.isEmpty()) throw new RuntimeException("joinChatByInviteLink returned TChat but t_supergroup not founded");
                Optional<Wiretap> optionalWiretapCheck = wiretapRepository.findByTSupergroup(optionalTSupergroup.get());
                if (optionalWiretapCheck.isPresent()) throw new InterlinkNotValidException("wiretap for such interlink is already exist");

                wiretap.setTelegramSupergroup(optionalTSupergroup.get());
                wiretap.setStatus(WiretapStatus.READY);
                wiretapRepository.save(wiretap);

                return "added successfully";
            } catch (TErrorException e){
                if(e.getTError().message == null ) throw e;
                if(e.getTError().message.equals(TErrorMessages.INVITE_REQUEST_SENT.name())) {
                    MappingInfo mappingInfo = new MappingInfo();
                    mappingInfo.setTitle(tChatInviteLinkInfo.title);
                    mappingInfo.setMemberCount(tChatInviteLinkInfo.memberCount);
                    mappingInfo.setDescription(tChatInviteLinkInfo.description);

                    mappingInfo.setWiretap(wiretap);
                    wiretap.setMappingInfo(mappingInfo);
                    wiretap.setStatus(WiretapStatus.WAITING);

                    wiretapRepository.save(wiretap);
                    return "will add after processing";
                }
                else if(e.getTError().message.equals(TErrorMessages.USER_ALREADY_PARTICIPANT.name())){
                    Optional<TelegramSupergroup> optionalTSupergroup = tSupergroupRepository.findByChatId(tChatInviteLinkInfo.chatId);
                    if(optionalTSupergroup.isEmpty()) throw new RuntimeException("joinChatByInviteLink return USER_ALREADY_PARTICIPANT but tSupergroupRepository.findByChatId(tChatInviteLinkInfo.chatId) is empty");

                    Optional<Wiretap> optionalWiretapCheck = wiretapRepository.findByTSupergroup(optionalTSupergroup.get());
                    if (optionalWiretapCheck.isPresent()) throw new InterlinkNotValidException("wiretap for such interlink is already exist");

                    wiretap.setTelegramSupergroup(optionalTSupergroup.get());
                    wiretap.setStatus(WiretapStatus.READY);
                    wiretapRepository.save(wiretap);

                    return "added successfully";
                }
                else throw e;
            }
        }
        else {
            TChat tChat = telegramApi.searchPublicChat(new TSearchPublicChat(interlink.getValue()));
            if (!(tChat.type instanceof TChatTypeSupergroup))  throw new InterlinkNotValidException("ChatType is not InviteLinkChatTypeChannel or InviteLinkChatTypeSupergroup");
            Optional<TelegramSupergroup> optionalTSupergroup = tSupergroupRepository.findById(new TelegramSupergroup.PK(((TChatTypeSupergroup) tChat.type).supergroupId, apiId));
            if(optionalTSupergroup.isEmpty()) throw new RuntimeException("TChat from telegramApi.searchPublicChat is present but in t_supergroup not present");

            Optional<Wiretap> optionalWiretapCheck = wiretapRepository.findByTSupergroup(optionalTSupergroup.get());
            if (optionalWiretapCheck.isPresent()) throw new InterlinkNotValidException("wiretap for such interlink is already exist");

            try{
                telegramApi.joinChat(new TJoinChat(tChat.id));
                wiretap.setTelegramSupergroup(optionalTSupergroup.get());
                wiretap.setStatus(WiretapStatus.READY);
                wiretapRepository.save(wiretap);

                return "added successfully";
            } catch (TErrorException e) {
                System.out.println(e);
                throw new RuntimeException(e);
            }
        }
        //госпади ну заработай так как нужно поалуйстац
    }

    public WiretapDetailsDTO getWiretapDetails(Long wId) {
        Optional<Wiretap> optionalWiretap = wiretapRepository.findById(wId);
        return optionalWiretap.map(wiretap -> new WiretapDetailsDTO(
                wiretap.getTelegramSupergroup().getDescription(),
                wiretap.getTelegramSupergroup().getUsername()
        )).orElse(null);
    }

    public List<TelegramMessageDTO> getWiretapMessages(Long wId, Long messageId) {
        int limit = 15;
        //TODO check on isPresent
        Wiretap wiretap = wiretapRepository.findById(wId).get();

        TelegramSupergroup telegramSupergroup = wiretap.getTelegramSupergroup();

        if(messageId == -1) return telegramMessageRepository.loadInitMessages(telegramSupergroup, limit).stream()
                .peek(m -> m.setWiretap(wiretap))
                .map(telegramMessageMapper::toDto)
                .toList();
        else return telegramMessageRepository.loadMessages(telegramSupergroup, messageId, limit).stream()
                .peek(m -> m.setWiretap(wiretap))
                .map(telegramMessageMapper::toDto)
                .toList();
    }
}