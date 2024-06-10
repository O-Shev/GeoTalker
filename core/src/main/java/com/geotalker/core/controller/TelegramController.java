package com.geotalker.core.controller;

import com.geotalker.core.dto.telegram.TObject.TChat;
import com.geotalker.core.service.TelegramService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/telegram/{api_id}")
public class TelegramController {
    private final TelegramService telegramService;

    @Autowired
    public TelegramController(TelegramService telegramService) {
        this.telegramService = telegramService;
    }

    @PostMapping("updateNewChat")
    public ResponseEntity<String> postGeoChat(@PathVariable("api_id") Integer apiId, @RequestBody TChat tChat){
        telegramService.updateNewChat(apiId, tChat);
        return ResponseEntity.ok("Ok");
    }
}
