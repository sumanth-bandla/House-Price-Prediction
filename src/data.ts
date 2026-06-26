export const indianStatesAndCities: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Kalyan-Dombivli", "Vasai-Virar", "Aurangabad", "Navi Mumbai"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli-Dharwad", "Mangalore", "Belagavi", "Davangere", "Bellary"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Erode"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Noida"],
  "West Bengal": ["Kolkata", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "Malda", "Baharampur"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali"],
  "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Kannur"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Phusro"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Raigarh"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Mandi", "Solan", "Palampur", "Baddi"],
  "Goa": ["Panaji", "Vasco da Gama", "Margao", "Mapusa", "Ponda"],
  "Chandigarh": ["Chandigarh"]
};

export const cityMultipliers: Record<string, number> = {
  // Premium Tier 1
  "Mumbai": 25000,
  "South Delhi": 22000,
  "New Delhi": 18000,
  
  // Tier 1
  "Bangalore": 12000,
  "Gurugram": 11000,
  "Pune": 10000,
  "Chennai": 9500,
  "Hyderabad": 9000,
  "Noida": 8500,
  "Thane": 12000,
  "Navi Mumbai": 11000,

  // Tier 2
  "Kolkata": 7500,
  "Ahmedabad": 7000,
  "Chandigarh": 8000,
  "Jaipur": 6000,
  "Lucknow": 6500,
  "Surat": 6500,
  "Kochi": 7000,
  "Indore": 6000,
  "Bhopal": 5500,
  "Vadodara": 5500,
  "Nagpur": 6000,
  "Visakhapatnam": 6500,
  "Coimbatore": 6500,
  "Thiruvananthapuram": 6000,
  "Mysore": 5500,
  "Mangalore": 5500,
  "Goa": 8500, // Premium due to tourism
  "Panaji": 9000,
  
  // Default Tier 3 Fallback logic will be applied in the algorithm
};
