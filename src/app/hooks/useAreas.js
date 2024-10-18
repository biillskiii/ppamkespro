import { useState, useEffect } from "react";
import axios from "axios";

const useAreas = () => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://ppamkespro.com/api/instrument/area"
        );
        if (response.data) {
          const provinceData = response.data.data || [];
          setProvinces(
            provinceData.map((item) => ({
              id: item.id || item.provinceId || "",
              name: item.name || item.provinceName || "",
              cities: item.cities || [],
            }))
          );
        }
      } catch (error) {
        setError("Failed to fetch provinces");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  const fetchCities = (provinceId) => {
    const selectedProvince = provinces.find(
      (province) => province.id === parseInt(provinceId)
    );
    if (selectedProvince) {
      setCities(
        selectedProvince.cities.map((city) => ({
          id: city.id || city.cityId || "",
          name: city.name || city.cityName || "",
        }))
      );
    } else {
      setCities([]);
    }
  };

  return { provinces, cities, fetchCities, isLoading, error };
};

export default useAreas;
