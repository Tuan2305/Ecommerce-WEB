package com.tuanvn.Ecommerce.Store.service.impl;

import com.tuanvn.Ecommerce.Store.modal.Order;
import com.tuanvn.Ecommerce.Store.modal.Seller;
import com.tuanvn.Ecommerce.Store.modal.SellerReport;
import com.tuanvn.Ecommerce.Store.modal.Transaction;
import com.tuanvn.Ecommerce.Store.repository.SellerRepository;
import com.tuanvn.Ecommerce.Store.repository.TransactionRepository;
import com.tuanvn.Ecommerce.Store.service.SellerReportService;
import com.tuanvn.Ecommerce.Store.service.SellerService;
import com.tuanvn.Ecommerce.Store.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final SellerRepository sellerRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository, SellerRepository sellerRepository) {
        this.transactionRepository = transactionRepository;
        this.sellerRepository = sellerRepository;
    }

    @Override
    public Transaction createTransaction(Order order) {
        Seller seller = sellerRepository.findById(order.getSellerId()).get();
        Transaction transaction = new Transaction();
        transaction.setSeller(seller);
        transaction.setCustomer(order.getUser());
        transaction.setOrder(order);

        return null;
    }

    @Override
    public List<Transaction> getTransactionsBySellerId(Seller seller) {
        return transactionRepository.findBySellerId(seller.getId());
    }



    @Override
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
