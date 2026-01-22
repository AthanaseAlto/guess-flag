export const fetchCountries = async () => {
  try {
    const response = await fetch(
      'https://restcountries.com/v3.1/all?fields=name,flags,capital,region'
    );
    if (!response.ok) throw new Error('Failed to fetch countries');
    const data = await response.json();
    const mapped = data.map((country) => ({
      name: country.name.common,
      flag: country.flags.svg || country.flags.png,
      capital: country.capital?.[0] || 'N/A',
      region: country.region,
    }));
    return { data: mapped, error: null };
  } catch (error) {
    console.error('Error fetching countries:', error);
    return { data: [], error: error?.message || 'Failed to load countries' };
  }
};

export const getRandomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
