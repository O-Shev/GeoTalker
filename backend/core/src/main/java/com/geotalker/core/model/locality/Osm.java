package com.geotalker.core.model.locality;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.io.Serializable;

@Embeddable
public class Osm implements Serializable {

    @Enumerated(EnumType.STRING)
    @Column(name = "osm_type", columnDefinition="osm_type", nullable = false)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private OsmType type;

    @Column(name = "osm_id", nullable = false)
    private Long id;

    public enum OsmType {
        N,
        W,
        R
    }

    public Osm() {
    }

    public Osm(String type, Long id) {
        setId(id);
        setType(strToType(type));
    }

    public Osm(String osmAsStr) {
        setType(strToType( String.valueOf(osmAsStr.charAt(0))));
        setId(Long.parseLong(osmAsStr.substring(1)));
    }

    public static OsmType strToType(String str) {
        return switch (str) {
            case "relation", "R" -> OsmType.R;
            case "way", "W" -> OsmType.W;
            case "node", "N" -> OsmType.N;
            default -> throw new RuntimeException("not valid osm type as string");
        };
    }

    public String getAsStr(){
        return this.type.toString() + this.id;
    }

    public OsmType getType() {
        return type;
    }

    public void setType(OsmType osmType) {
        this.type = osmType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long osmId) {
        this.id = osmId;
    }

    @Override
    public String toString() {
        return "OsmTypeId{" +
                "type=" + type +
                ", id=" + id +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Osm osm)) return false;

        if (getType() != osm.getType()) return false;
        return getId() != null ? getId().equals(osm.getId()) : osm.getId() == null;
    }

    @Override
    public int hashCode() {
        int result = getType() != null ? getType().hashCode() : 0;
        result = 31 * result + (getId() != null ? getId().hashCode() : 0);
        return result;
    }
}

