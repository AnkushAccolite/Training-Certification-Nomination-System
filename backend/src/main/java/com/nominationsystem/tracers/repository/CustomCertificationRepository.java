package com.nominationsystem.tracers.repository;

import java.util.List;

public interface CustomCertificationRepository {

    List<String> findDistinctDomains();

}
