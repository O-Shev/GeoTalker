package com.geotalker.core.service;

import com.geotalker.core.model.locality.Osm;
import io.minio.*;
import io.minio.errors.*;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

@Service
public class StorageService {

    private final MinioClient minioClient;

    public StorageService(@Value("${spring.minio.host}") String host,
                          @Value("${spring.minio.port}") int port,
                          @Value("${spring.minio.use-ssl}") boolean useSsl,
                          @Value("${spring.minio.access-key}") String accessKey,
                          @Value("${spring.minio.secret-key}") String secretKey) {

        this.minioClient = MinioClient.builder()
                .endpoint(host, port, useSsl)
                .credentials(accessKey, secretKey)
                .build();
    }

    public Resource getBoundaries(Osm osm){
        try {
            InputStream stream = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket("boundaries")
                            .object(osm.getAsStr())
                            .build());

            return new ByteArrayResource(IOUtils.toByteArray(stream));
        } catch (Exception e){
            throw new RuntimeException("failed fetch boundaries");
        }
    }

    public String getBoundariesContentType(Osm osm){
        try{
            StatObjectResponse objectStat = minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket("boundaries")
                            .object(osm.getAsStr())
                            .build());
            return objectStat.contentType();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Boolean isPresentBoundaries(Osm osm){
        try {
            minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket("boundaries")
                            .object(osm.getAsStr())
                            .build());
        } catch (ErrorResponseException e) {
            if(e.errorResponse().code().equals("NoSuchKey")) return false;
            else throw new RuntimeException(e);
        } catch (Exception e){
            throw new RuntimeException(e);
        }
        return true;
    }

    public Resource getTelegramProfilePhoto(String id) {
        try {
            InputStream stream = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket("telegram.profile-photo")
                            .object(id)
                            .build());

            return new ByteArrayResource(IOUtils.toByteArray(stream));
        } catch (Exception e){
            throw new RuntimeException("failed fetch ProfilePhoto");
        }
    }

    public Resource getTelegramFile(String bucket, String file){
        try {
            InputStream stream = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket("telegram.".concat(bucket))
                            .object(file)
                            .build());

            return new ByteArrayResource(IOUtils.toByteArray(stream));
        } catch (IOException | ErrorResponseException | InsufficientDataException | InternalException |
                 InvalidKeyException | InvalidResponseException | NoSuchAlgorithmException | ServerException |
                 XmlParserException e){
            return null;
        }
    }


    public void putBoundaries(byte[] data, String name){
        InputStream stream = new ByteArrayInputStream(data);
        try {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket("boundaries")
                            .object(name)
                            .stream(stream, data.length, -1)
                            .contentType("application/topojson")
                            .extraHeaders(new HashMap<>() {{
                                put("Content-Encoding", "gzip");
                            }})
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
