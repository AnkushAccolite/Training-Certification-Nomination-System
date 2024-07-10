package com.nominationsystem.tracers.repository;

import com.mongodb.client.DistinctIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import org.bson.Document;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CustomCourseRepositoryImplTest {

    @InjectMocks
    private CustomCourseRepositoryImpl customCourseRepository;

    @Mock
    private MongoTemplate mongoTemplate;

    @Mock
    private MongoCollection<Document> mongoCollection;

    @Mock
    private DistinctIterable<String> distinctIterable;

    @Mock
    private MongoCursor<String> mongoCursor;

    @BeforeEach
    public void setUp() {
        when(mongoTemplate.getCollection("Course")).thenReturn(mongoCollection);
        when(mongoCollection.distinct("domain", String.class)).thenReturn(distinctIterable);
    }

    @Test
    public void testFindDistinctDomains() {
        List<String> expectedDomains = Arrays.asList("Technology", "Business", "Health");

        when(distinctIterable.iterator()).thenReturn(mongoCursor);
        when(mongoCursor.hasNext()).thenReturn(true, true, true, false);
        when(mongoCursor.next()).thenReturn("Technology", "Business", "Health");

        List<String> result = customCourseRepository.findDistinctDomains();
        assertEquals(expectedDomains, result);

        verify(mongoTemplate, times(1)).getCollection("Course");
        verify(mongoCollection, times(1)).distinct("domain", String.class);
        verify(distinctIterable, times(1)).iterator();
        verify(mongoCursor, times(4)).hasNext();
        verify(mongoCursor, times(3)).next();
    }
}
