package com.ChatMap.Location.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.ChatMap.Location.Entities.Location;

public interface LocationRepository extends CrudRepository<Location, Integer> {
	 @Query(value = """
		        SELECT *
		        FROM location
		        WHERE id <> :currentUserId
		          AND ST_Distance_Sphere(
		                POINT(location.longitude, location.latitude),
		                POINT(:lon, :lat)
		              ) < :radius
		        """,
		        nativeQuery = true)
		    List<Location> findNearbyLocationsNotCurrent(
		        @Param("lat") double latitude,
		        @Param("lon") double longitude,
		        @Param("radius") double radius,
		        @Param("currentUserId") Integer currentUserId
		    );
}
