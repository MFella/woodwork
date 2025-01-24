package com.woodapi.dtos;

import java.util.Random;

public class AvailableComponentsDTO {
    private final static Integer RANDOM_COUNT_NUMBER_MAX = 1000;
    private Integer lumberCount = 0;
    private Integer beamCount = 0;
    private Integer joistCount = 0;
    private Integer plywoodCount = 0;
    private Integer doorCount = 0;
    private final static Random randomGenerator = new Random();

    public AvailableComponentsDTO() {
        // Randomize count of available resource - mock purpose
        this.randomizeWoodComponentCounts();
    }

    public Integer getCount(WoodComponent woodComponent) {
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

    private void randomizeWoodComponentCounts() {
        this.beamCount = AvailableComponentsDTO.randomGenerator.nextInt(AvailableComponentsDTO.RANDOM_COUNT_NUMBER_MAX + 1);
        this.doorCount = AvailableComponentsDTO.randomGenerator.nextInt(AvailableComponentsDTO.RANDOM_COUNT_NUMBER_MAX + 1);
        this.plywoodCount = AvailableComponentsDTO.randomGenerator.nextInt(AvailableComponentsDTO.RANDOM_COUNT_NUMBER_MAX + 1);
        this.joistCount = AvailableComponentsDTO.randomGenerator.nextInt(AvailableComponentsDTO.RANDOM_COUNT_NUMBER_MAX + 1);
        this.lumberCount = AvailableComponentsDTO.randomGenerator.nextInt(AvailableComponentsDTO.RANDOM_COUNT_NUMBER_MAX + 1);
    }
}
