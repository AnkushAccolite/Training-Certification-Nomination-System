package com.nominationsystem.tracers.controller;

import com.nominationsystem.tracers.models.CertificationsFAQ;
import com.nominationsystem.tracers.models.CoursesFAQ;
import com.nominationsystem.tracers.repository.CertificationsFaqRepository;
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

    @Autowired
    private CertificationsFaqRepository certificationsFaqRepository;

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

    @GetMapping("/certifications")
    public List<CertificationsFAQ> getCertificationsFaq(){
        List<CertificationsFAQ> faqs=this.certificationsFaqRepository.findAll();
        return faqs.stream()
                .filter(faq -> !faq.getIsDeleted())
                .collect(Collectors.toList());
    }

    @PostMapping("/certifications")
    public void addCertificationsFaq(@RequestBody CertificationsFAQ certificationsFAQ){
        this.certificationsFaqRepository.save(certificationsFAQ);
    }

    @GetMapping("/certifications/delete")
    public void deleteCertificationsFaq(@RequestParam String faqId){
        CertificationsFAQ certificationsFAQ = this.certificationsFaqRepository.findByFaqId(faqId);
        certificationsFAQ.setIsDeleted(true);
        this.certificationsFaqRepository.save(certificationsFAQ);
    }

    @PutMapping("/certifications/{id}")
    public void editCertificationsFaq(@PathVariable("id") String faqId,@RequestBody CertificationsFAQ certificationsFAQ){
        CertificationsFAQ faq = this.certificationsFaqRepository.findByFaqId(faqId);
        faq.setQuestion(certificationsFAQ.getQuestion());
        faq.setAnswer(certificationsFAQ.getAnswer());
        this.certificationsFaqRepository.save(faq);
    }

}
