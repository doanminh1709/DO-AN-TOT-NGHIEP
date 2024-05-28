package com.shop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shop.entitty.model.Favorite;
import com.shop.entitty.model.Product;
import com.shop.entitty.model.User;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long>{
	List<Favorite> findByUser(User user);
	Integer countByProduct(Product product);
	Favorite findByProductAndUser(Product product, User user);
}
