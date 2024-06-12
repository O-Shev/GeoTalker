package com.geotalker.core.controller;


import com.geotalker.core.dto.client.*;
import com.geotalker.core.dto.client.form.AddChatForm;
import com.geotalker.core.model.Interlink;
import com.geotalker.core.model.UserAccount;
import com.geotalker.core.model.locality.Coordinates;
import com.geotalker.core.model.locality.Osm;
import com.geotalker.core.service.*;
import com.geotalker.core.util.LocalityDTOGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.WebSocketSession;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@RestController
@RequestMapping("/client")
public class ClientController {

    private final ClientService clientService;
    private final LocalityService localityService;
    private final TelegramService telegramService;
    private final StorageService storageService;


    private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Autowired
    public ClientController(ClientService clientService, LocalityService localityService,
                            TelegramService telegramService, StorageService storageService){
        this.clientService = clientService;
        this.localityService = localityService;
        this.telegramService = telegramService;

        this.storageService = storageService;
    }

    @GetMapping("previewByInterlink")
    @ResponseBody
    public ResponseEntity<InterlinkPreview> getPreviewByInterlink(@RequestParam() String inputInterlink){
        Interlink interlink = new Interlink(inputInterlink);
        return ResponseEntity.ok(telegramService.getPreviewByInterlink(interlink));
    }

    @GetMapping("placesByLngLat")
    @ResponseBody
    public ResponseEntity<List<LocalityDTO>> getPlacesByLngLat(@RequestParam() Double longitude,
                                                               @RequestParam() Double latitude){
        Coordinates coordinates = new Coordinates();
        coordinates.setLatitude(latitude);
        coordinates.setLongitude(longitude);
        return ResponseEntity.ok(localityService.getLocalitiesPreview(coordinates));
    }


    @GetMapping("placesByStr")
    @ResponseBody
    public ResponseEntity<List<LocalityDTO>> getPlacesByStr(@RequestParam() String q){

        return ResponseEntity.ok(localityService.getLocalitiesPreview(q));
    }

    
    @PostMapping("postGeoChat")
    @ResponseBody
    public ResponseEntity<String> postGeoChat(@RequestBody AddChatForm addChatForm, Authentication authentication){
        UserAccount userAccount = (UserAccount) authentication.getPrincipal();
        return ResponseEntity.ok(clientService.postNewWiretap(addChatForm, userAccount));
    }

    @GetMapping("getInitialWiretaps")
    @ResponseBody
    public ResponseEntity<List<WiretapDTO>> getInitialWiretaps(){
        return ResponseEntity.ok(clientService.getReadyWiretaps());
    }

    @GetMapping("getInitialLocalities")
    @ResponseBody
    public ResponseEntity<List<LocalityDTO>> getInitialLocalities(){
        return ResponseEntity.ok(localityService.getReadyLocalities());
    }

    @GetMapping("getInitialLocalitiesDev")
    @ResponseBody
    public ResponseEntity<List<LocalityDTO>> getInitialLocalitiesDev(@RequestParam() int count){
        return ResponseEntity.ok(LocalityDTOGenerator.generateLocalityDTOs(count));
    }

    @GetMapping("getBoundaries/{id}")
    public ResponseEntity<Resource> getBoundaries(@PathVariable String id){
        Osm osm = new Osm(id);
        return ResponseEntity.ok()
                .header("Content-Type", "application/topojson")
                .header("Content-Encoding", "gzip")
                .body(storageService.getBoundaries(osm));
    }

    @GetMapping("getTelegramProfilePhoto/{id}")
    public ResponseEntity<Resource> getTelegramProfilePhoto(@PathVariable String id){
        Resource resource = storageService.getTelegramProfilePhoto(id);
        if(resource == null ) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok()
                .body(storageService.getTelegramProfilePhoto(id));
    }

    @GetMapping("file/telegram/{bucket}/{file}")
    public ResponseEntity<Resource> getTelegramFile(@PathVariable String bucket,
                                                    @PathVariable String file){
        return ResponseEntity.ok()
                .body(storageService.getTelegramFile(bucket, file));
    }

    @GetMapping("getWiretapDetails/{wId}")
    public ResponseEntity<WiretapDetailsDTO> getWiretapDetails(@PathVariable Long wId){
        return ResponseEntity.ok(clientService.getWiretapDetails(wId));
    }

    @GetMapping("loadMessages/{wiretapId}/{fromMessageId}")
    public ResponseEntity<List<TelegramMessageDTO>> loadMessages(@PathVariable Long wiretapId,
                                                                 @PathVariable Long fromMessageId){
        return ResponseEntity.ok(clientService.getWiretapMessages(wiretapId, fromMessageId));
    }

    @GetMapping("testEndpoint")
    public ResponseEntity<?> testEndpoint() {
        return ResponseEntity.ok().build();
    }


//    @GetMapping("createAndSaveLocalityWithHierarchy")
//    @ResponseBody
//    public ResponseEntity<String> createAndSaveLocalityWithHierarchy(@RequestParam() String osm){
//        localityService.createAndSaveLocalityWithHierarchy(new Osm(osm.substring(0, 1), Long.parseLong(osm.substring(1))));
//        return ResponseEntity.ok("ok");
//    }
}



//@GetMapping("getLocalityByCountryCode")
//@ResponseBody
//public ResponseEntity<LocalityPreview> getCountry(@RequestParam() String q){
//    NResponse[] nResponses = nominatimApi.searchCountry(q);
//    NResponse l = nResponses[0];
//
//    return ResponseEntity.ok(new LocalityPreview(
//            OsmTypeId.strToType(l.osmType()).toString() + l.osmId(),
//            l.boundingbox(),
//            l.displayName(),
//            l.geojson(),
//            l.lon(),
//            l.lat()));
//}