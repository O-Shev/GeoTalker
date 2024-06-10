package com.geotalker.core.model.locality;

import com.geotalker.core.model.Wiretap;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "locality", schema = "core")
public class Locality {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Embedded
    private Osm osm;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "rank_address", nullable = false)
    private Integer rankAddress;

    @Embedded
    private Coordinates coordinates;

    @Embedded
    private BoundingBox boundingBox;

    @OneToMany(mappedBy = "locality")
    private List<Wiretap> wiretap;


    public Locality() {
    }

    public List<Wiretap> getWiretap() {
        return wiretap;
    }

    public void setWiretap(List<Wiretap> wiretap) {
        this.wiretap = wiretap;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Integer getRankAddress() {
        return rankAddress;
    }

    public void setRankAddress(Integer rankAddress) {
        this.rankAddress = rankAddress;
    }

    public Coordinates getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(Coordinates coordinates) {
        this.coordinates = coordinates;
    }

    public BoundingBox getBoundingBox() {
        return boundingBox;
    }

    public void setBoundingBox(BoundingBox boundingBox) {
        this.boundingBox = boundingBox;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Osm getOsm() {
        return osm;
    }

    public void setOsm(Osm osm) {
        this.osm = osm;
    }


    @Override
    public String toString() {
        return "Locality{" +
                "id=" + id +
                ", osmTypeId=" + osm +
                ", wiretap=" + wiretap +
                '}';
    }
}
