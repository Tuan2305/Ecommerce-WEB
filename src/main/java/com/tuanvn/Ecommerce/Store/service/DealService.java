package com.tuanvn.Ecommerce.Store.service;

import com.tuanvn.Ecommerce.Store.modal.Deal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DealService {
    List<Deal> getDeals();
    Deal createDeal(Deal deal);

    Deal updateDeal(Deal deal, Long id) throws Exception;

    void deleteDeal(Long id) throws Exception;
}
