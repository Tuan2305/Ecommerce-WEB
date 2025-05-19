package com.tuanvn.Ecommerce.Store.modal;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Home {
    private List<HomeCategory> grid;
    private List<HomeCategory> shopByCategories;
    private List<HomeCategory> electricCategories;

    public List<HomeCategory> getGrid() {
        return grid;
    }

    public void setGrid(List<HomeCategory> grid) {
        this.grid = grid;
    }

    public List<HomeCategory> getShopByCategories() {
        return shopByCategories;
    }

    public void setShopByCategories(List<HomeCategory> shopByCategories) {
        this.shopByCategories = shopByCategories;
    }

    public List<HomeCategory> getDealCategories() {
        return dealCategories;
    }

    public void setDealCategories(List<HomeCategory> dealCategories) {
        this.dealCategories = dealCategories;
    }

    public List<HomeCategory> getElectricCategories() {
        return electricCategories;
    }

    public void setElectricCategories(List<HomeCategory> electricCategories) {
        this.electricCategories = electricCategories;
    }

    public List<Deal> getDeals() {
        return deals;
    }

    public void setDeals(List<Deal> deals) {
        this.deals = deals;
    }

    private List<HomeCategory> dealCategories;
    private List<Deal> deals;
}
