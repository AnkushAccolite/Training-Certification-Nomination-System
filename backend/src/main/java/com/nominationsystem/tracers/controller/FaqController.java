package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.CoursesFAQ;
import com.nominationsystem.tracers.repository.CoursesFaqRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/faq")
public class FaqController {

    @Autowired
    private CoursesFaqRepository coursesFaqRepository;

    @GetMapping("/courses")
    public List<CoursesFAQ> getCoursesFaq(){
        List<CoursesFAQ> faqs=this.coursesFaqRepository.findAll();
        return faqs.stream()
                .filter(faq -> !faq.getIsDeleted())
                .collect(Collectors.toList());
    }

    @PostMapping("/courses")
    public void addCoursesFaq(@RequestBody CoursesFAQ coursesFAQ){
        this.coursesFaqRepository.save(coursesFAQ);
    }

    @GetMapping("/courses/delete")
    public void deleteFaq(@RequestParam String faqId){
        CoursesFAQ coursesFAQ = this.coursesFaqRepository.findByFaqId(faqId);
        coursesFAQ.setIsDeleted(true);
        this.coursesFaqRepository.save(coursesFAQ);
    }

    @PutMapping("/courses/{id}")
    public void editFaq(@PathVariable("id") String faqId,@RequestBody CoursesFAQ coursesFAQ){
        CoursesFAQ faq = this.coursesFaqRepository.findByFaqId(faqId);
        faq.setQuestion(coursesFAQ.getQuestion());
        faq.setAnswer(coursesFAQ.getAnswer());
        this.coursesFaqRepository.save(faq);
    }
}
