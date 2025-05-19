package com.tuanvn.Ecommerce.Store.service.impl;

import com.tuanvn.Ecommerce.Store.domain.HomeCategorySection;
import com.tuanvn.Ecommerce.Store.modal.Deal;
import com.tuanvn.Ecommerce.Store.modal.Home;
import com.tuanvn.Ecommerce.Store.modal.HomeCategory;
import com.tuanvn.Ecommerce.Store.repository.DealRepository;
import com.tuanvn.Ecommerce.Store.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;



@Service
@RequiredArgsConstructor
public class HomeServiceImpl implements HomeService {

    private final DealRepository dealRepository;

    public HomeServiceImpl(DealRepository dealRepository) {
        this.dealRepository = dealRepository;
    }

    @Override
    public Home createHomePageData(List<HomeCategory> allCategories) {

        List<HomeCategory> gridCategories = allCategories.stream()
                .filter(category ->
                        category.getSection() == HomeCategorySection.GRID)
                .toList();

        List<HomeCategory> shopByCategories = allCategories.stream()
                .filter(category ->
                        category.getSection() == HomeCategorySection.SHOP_BY_CATEGORIES)
                .toList();

        List<HomeCategory> electricCategories = allCategories.stream()
                .filter(category ->
                        category.getSection() == HomeCategorySection.ELECTRIC_CATEGORIES)
                .toList();

        List<HomeCategory> dealCategories = allCategories.stream()
                .filter(category ->
                        category.getSection() == HomeCategorySection.DEALS)
                .toList();
        List<Deal> createdDeals= new ArrayList<>();

        if(dealRepository.findAll().isEmpty()){
            List<Deal> deals = allCategories.stream()
                    .filter(category -> category.getSection() == HomeCategorySection.DEALS)
                    .map(category -> new Deal(null,10,category)) // Assuming a
                    .toList();
            createdDeals = dealRepository.saveAll(deals);
        }
        else{createdDeals = dealRepository.findAll();
        }
        Home home = new Home();
        home.setGrid(gridCategories);
        home.setShopByCategories(shopByCategories);
        home.setElectricCategories(electricCategories);
        home.setDeals(createdDeals);
        home.setDealCategories(dealCategories);

        return home;
    }
}
