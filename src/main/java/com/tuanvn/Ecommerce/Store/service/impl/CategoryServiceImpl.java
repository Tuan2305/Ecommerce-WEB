package com.tuanvn.Ecommerce.Store.service.impl;

import com.tuanvn.Ecommerce.Store.modal.Category;
import com.tuanvn.Ecommerce.Store.repository.CategoryRepository;
import com.tuanvn.Ecommerce.Store.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    @Override
    public List<Category> getCategoriesByLevel(Integer level) {
        return categoryRepository.findAll().stream()
                .filter(category -> level.equals(category.getLevel()))
                .collect(Collectors.toList());
    }

    @Override
    public List<Category> getChildCategories(Long parentId) {
        Category parent = categoryRepository.findById(parentId).orElse(null);
        if (parent == null) {
            return List.of();
        }

        return categoryRepository.findAll().stream()
                .filter(category -> parent.equals(category.getParentCategory()))
                .collect(Collectors.toList());
    }
}