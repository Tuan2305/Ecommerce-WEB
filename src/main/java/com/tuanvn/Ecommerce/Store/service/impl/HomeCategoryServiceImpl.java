package com.tuanvn.Ecommerce.Store.service.impl;

import com.tuanvn.Ecommerce.Store.modal.HomeCategory;
import com.tuanvn.Ecommerce.Store.repository.HomeCategoryRepository;
import com.tuanvn.Ecommerce.Store.service.HomeCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HomeCategoryServiceImpl implements HomeCategoryService {

    private final HomeCategoryRepository homeCategoryRepository;

    public HomeCategoryServiceImpl(HomeCategoryRepository homeCategoryRepository) {
        this.homeCategoryRepository = homeCategoryRepository;
    }

    @Override
    public HomeCategory createHomeCategory(HomeCategory homeCategory) {
        return homeCategoryRepository.save(homeCategory);
    }

    @Override
    public List<HomeCategory> createCategories(List<HomeCategory> homeCategories) {
        if(homeCategoryRepository.findAll().isEmpty()){
            return homeCategoryRepository.saveAll(homeCategories);
        }
        return homeCategoryRepository.findAll();
    }

    @Override
    public HomeCategory updateHomeCategory(HomeCategory category, Long id) throws Exception {
        HomeCategory existingCategory = homeCategoryRepository.findById(id)
                .orElseThrow(() -> new Exception("Category not found"));

        if(category.getImage()!=null) {
            existingCategory.setImage(category.getImage());
        }
        if(category.getCategoryId()!=null){
            existingCategory.setCategoryId(category.getCategoryId());
        }

        return homeCategoryRepository.save(existingCategory);

    }

    @Override
    public List<HomeCategory> getAllHomeCategories() {
        return homeCategoryRepository.findAll();
    }
}
