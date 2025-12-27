package com.ChatMap.Api.Repositories;


import com.ChatMap.Api.Entities.Location;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LocationRepository extends CrudRepository<Location, Integer> {
	 @Query(value = """
		        SELECT *
		        FROM locations
		        WHERE id <> :currentUserId
		          AND ST_Distance_Sphere(
		                POINT(locations.longitude, locations.latitude),
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
