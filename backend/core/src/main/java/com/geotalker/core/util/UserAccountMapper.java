package com.geotalker.core.util;

import com.geotalker.core.dto.client.UserAccountDTO;
import com.geotalker.core.model.UserAccount;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserAccountMapper {


    UserAccountDTO toDto(UserAccount userAccount);
}
