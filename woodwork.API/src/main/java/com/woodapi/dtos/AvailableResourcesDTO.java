package com.woodapi.dtos;

public class AvailableResourcesDTO {
    private Long lumberCount = null;
    private Long beamCount = null;
    private Long joistCount = null;
    private Long plywoodCount = null;
    private Long doorCount = null;

    public AvailableResourcesDTO() {
    }

    public Long getCount(WoodComponent woodComponent) {
        switch (woodComponent) {
            case Lumber: {
                return this.lumberCount;
            }
            case Beam: {
                return this.beamCount;
            }
            case Joist: {
                return this.joistCount;
            }
            case Plywood: {
                return this.plywoodCount;
            }
            case Door: {
                return this.doorCount;
            }
            default: {
                return null;
            }
        }
    }
}
