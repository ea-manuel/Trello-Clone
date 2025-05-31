package com.taskhive.taskhive_backend.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "lists")
public class TaskList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    // Many lists belong to one board
    @ManyToOne
    @JoinColumn(name = "board_id", nullable = false)
    public Board board;

    // One list can have many cards
    @OneToMany(mappedBy = "list", cascade = CascadeType.ALL)
    private List<Card> cards = new ArrayList<>();

    // Getters and setters can be added/generated
}


