package com.geotalker.core.service;

import com.geotalker.core.api.HtmlApi;
import com.geotalker.core.dto.client.InterlinkPreview;
import com.geotalker.core.dto.html.HtmlChatPreview;
import com.geotalker.core.dto.telegram.TObject.TChat;
import com.geotalker.core.dto.telegram.TObject.TChatType.TChatTypeSupergroup;
import com.geotalker.core.model.Interlink;
import com.geotalker.core.model.TelegramSupergroup;
import com.geotalker.core.model.Wiretap;
import com.geotalker.core.model.enums.WiretapStatus;
import com.geotalker.core.repository.*;
import com.geotalker.core.util.HtmlChatPreviewHandler;
import com.geotalker.core.util.InterlinkNotValidException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static com.geotalker.core.util.ValidationConstants.MINIMUM_MEMBER_COUNT;

@Service
@Transactional
public class TelegramService {

    private  final WiretapRepository wiretapRepository;
    private final HtmlApi htmlApi;
    private final HtmlChatPreviewHandler htmlChatPreviewHandler;
    private final MappingInfoRepository mappingInfoRepository;

    @Autowired
    public TelegramService(WiretapRepository wiretapRepository, HtmlApi htmlApi, HtmlChatPreviewHandler htmlChatPreviewHandler, MappingInfoRepository mappingInfoRepository) {
        this.wiretapRepository = wiretapRepository;
        this.htmlApi = htmlApi;
        this.htmlChatPreviewHandler = htmlChatPreviewHandler;
        this.mappingInfoRepository = mappingInfoRepository;
    }

    public InterlinkPreview getPreviewByInterlink(Interlink interlink){

        HtmlChatPreview htmlChatPreview;
        try {
            htmlChatPreview = htmlApi.getTelegramPreview(interlink.getAsUrl());
            System.out.println(htmlChatPreview);
        } catch (Exception e){
            return new InterlinkPreview(null, true, "Can't process chat preview. It will process after will be completed add this chat.");
        }
        if (htmlChatPreview.extra != null){
            String type = htmlChatPreviewHandler.extractChatType(htmlChatPreview.extra);
            int memberCount;
            if (type.equals("CHANNEL") || type.equals("GROUP")) {
                memberCount = htmlChatPreviewHandler.extractMembersCount(htmlChatPreview.extra);
            }else if(type.equals("USER")){
                throw new InterlinkNotValidException("username should correspond channel or group, not user");
            } else throw new RuntimeException("unexpected extra field");

            InterlinkPreview.Preview preview = new InterlinkPreview.Preview(htmlChatPreview.title,
                    htmlChatPreview.extra,
                    htmlChatPreview.description,
                    htmlChatPreview.photoUrl);

            if(memberCount >= MINIMUM_MEMBER_COUNT) return new InterlinkPreview(preview, true, "");
            else return new InterlinkPreview(preview, false, "member count of channel/group should be at least " + MINIMUM_MEMBER_COUNT);

        } else throw new InterlinkNotValidException("seems channel or group corresponded this link dont exist");

    }




    public void updateNewChat(Integer apiId, TChat tChat) {

        if(!(tChat.type instanceof TChatTypeSupergroup)) return;

        TelegramSupergroup telegramSupergroup = new TelegramSupergroup();
//        telegramSupergroup.setPk(new TelegramSupergroup.PK(((TChatTypeSupergroup) tChat.type).supergroupId, apiId));
        telegramSupergroup.setId(((TChatTypeSupergroup) tChat.type).supergroupId);
        telegramSupergroup.setApiId(apiId);

        Optional<Wiretap> optionalWiretapCheck = wiretapRepository.findByTSupergroup(telegramSupergroup);
        if (optionalWiretapCheck.isPresent()) return;

        List<Wiretap> wiretapWaitingList = wiretapRepository.findByStatus(WiretapStatus.WAITING);
        List<Wiretap> wiretapMatchingList = wiretapWaitingList.stream()
                .filter(w -> w.getMappingInfo() != null)
                .filter(w -> w.getMappingInfo().getTitle() != null)
                .filter(w -> w.getMappingInfo().getTitle().equals(tChat.title))
                .toList();

        //TODO check by chat_id and interlink
        if (wiretapMatchingList.isEmpty()) return;
        else if(wiretapMatchingList.size() == 1) {
            Wiretap wiretap = wiretapMatchingList.getFirst();
            wiretap.setTelegramSupergroup(telegramSupergroup);
            wiretap.setStatus(WiretapStatus.READY);

            mappingInfoRepository.delete(wiretap.getMappingInfo());
            wiretap.setMappingInfo(null);

            wiretapRepository.save(wiretap);
        }
        else System.out.println("TelegramService.updateNewChat: wiretapMatchingList.size() != 1");
    }
}
