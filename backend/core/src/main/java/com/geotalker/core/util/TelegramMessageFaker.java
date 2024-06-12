package com.geotalker.core.util;


import net.datafaker.Faker;
import org.springframework.stereotype.Component;

import java.util.HashMap;

@Component
public class TelegramMessageFaker {
    //TODO Determinism based on 3th value (v3) refreshed every hour
    Faker faker = new Faker();
    HashMap<Integer, FakeUser> cachedFakeUser = new HashMap<>();

    public record FakeUser(String name,
                           String avatar){}

    private static int combineHashCodes(Long v1, Long v2) {
        int hash1 = v1.hashCode();
        int hash2 = v2.hashCode();
        return hash1 ^ hash2;
    }

    public FakeUser getFakeUser(Long v1, Long v2){
        int hash = combineHashCodes(v1, v2);

        if(cachedFakeUser.containsKey(hash)) return cachedFakeUser.get(hash);

        FakeUser fakeUser = new FakeUser(
                faker.funnyName().name(),
                faker.avatar().image());

        cachedFakeUser.put(hash, fakeUser);

        return fakeUser;
    }
}
