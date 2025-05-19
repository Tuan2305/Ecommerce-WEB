package com.tuanvn.Ecommerce.Store.service;

import com.tuanvn.Ecommerce.Store.modal.Order;
import com.tuanvn.Ecommerce.Store.modal.Seller;
import com.tuanvn.Ecommerce.Store.modal.Transaction;

import java.util.List;

public interface TransactionService {
    Transaction createTransaction(Order order);
    List<Transaction> getTransactionsBySellerId(Seller seller);
    List<Transaction> getAllTransactions();
}
