package com.tuanvn.Ecommerce.Store.controller;

import com.tuanvn.Ecommerce.Store.modal.Category;
import com.tuanvn.Ecommerce.Store.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-level/{level}")
    public ResponseEntity<List<Category>> getCategoriesByLevel(@PathVariable Integer level) {
        List<Category> categories = categoryRepository.findAll().stream()
                .filter(category -> level.equals(category.getLevel()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/by-parent/{parentId}")
    public ResponseEntity<List<Category>> getChildCategories(@PathVariable Long parentId) {
        Category parent = categoryRepository.findById(parentId).orElse(null);
        if (parent == null) {
            return ResponseEntity.notFound().build();
        }

        List<Category> childCategories = categoryRepository.findAll().stream()
                .filter(category -> parent.equals(category.getParentCategory()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(childCategories);
    }
}