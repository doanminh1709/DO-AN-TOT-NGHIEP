package com.shop.utils;
import com.shop.entitty.model.Product;
import com.shop.entitty.model.Voucher;
import com.shop.repository.ProductRepository;
import com.shop.repository.VoucherRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class ScheduleVoucher {
    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private ProductRepository productRepository;
    private final Logger log = LoggerFactory.getLogger(ScheduleBirthdayOfCustomer.class);

    //<second><minute> <hour> <day-of-month> <month> <day-of-week><year> <command>
    @Scheduled(cron = "0 0 18-19 * * ?")
    public void sentGreetingsToCustomer() {

        List<Voucher> voucherList = voucherRepository.getAllVoucherExpired();
        Set<Long> productSetId = new HashSet<>();
        Set<Long> categorySetId = new HashSet<>();
        if (voucherList != null &&!voucherList.isEmpty()) {
            voucherList.forEach((item)->{
                item.setStatus(Boolean.FALSE);
               if(item.getProduct() != null){
                   productSetId.add(item.getProduct().getProductId());
               }
               if(item.getCategory() != null){
                   categorySetId.add(item.getCategory().getCategoryId());
               }
            });
        }

        List<Product> products = new ArrayList<>();
        if(productSetId != null && !productSetId.isEmpty()){
            products = productRepository.findByProductIdIn(new ArrayList<>(productSetId));
        }

        if(categorySetId != null && !categorySetId.isEmpty()){
            List<Product> productByCategoryIn = productRepository.findByListCategoryId(new ArrayList<>(categorySetId));
            if(products != null && !products.isEmpty()){
                products.addAll(productByCategoryIn);
            }
        }

        //set lai nhung san pham het khuyen mai ve 0 %
        products.forEach(item -> item.setDiscount(0));
        productRepository.saveAll(products);
        voucherRepository.saveAll(voucherList);
    }
}
