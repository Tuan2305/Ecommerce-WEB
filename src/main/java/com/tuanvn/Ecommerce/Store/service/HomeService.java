package com.tuanvn.Ecommerce.Store.service;

import com.tuanvn.Ecommerce.Store.modal.Home;
import com.tuanvn.Ecommerce.Store.modal.HomeCategory;

import java.util.List;

public interface HomeService {
    public Home createHomePageData(List<HomeCategory> allCategories);
}
