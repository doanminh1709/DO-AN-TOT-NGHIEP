package com.shop.api;

import com.shop.entitty.model.Contact;
import com.shop.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/contacts")
public class ContactApi {

    @Autowired
    private ContactRepository contactRepository;

    @GetMapping
    public ResponseEntity<List<Contact>> getAll() {
        return ResponseEntity.ok(contactRepository.findAll());
    }

    @GetMapping("{id}")
    public ResponseEntity<Contact> getById(@PathVariable("id") Long id) {
        if (!contactRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(contactRepository.findById(id).get());
    }

    @PostMapping
    public ResponseEntity<Contact> post(@RequestBody Contact contact) {
        if (contact.getId() != null && contactRepository.existsById(contact.getId())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(contactRepository.save(contact));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if(!contactRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        contactRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
