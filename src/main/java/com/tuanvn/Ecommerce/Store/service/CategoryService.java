package com.tuanvn.Ecommerce.Store.service;

import com.tuanvn.Ecommerce.Store.modal.Category;
import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    Category getCategoryById(Long id);
    List<Category> getCategoriesByLevel(Integer level);
    List<Category> getChildCategories(Long parentId);
}