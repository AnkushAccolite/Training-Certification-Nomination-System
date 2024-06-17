package com.nominationsystem.tracers.repository;

import java.util.List;

public interface CustomCourseRepository {

    List<String> findDistinctDomains();

}
