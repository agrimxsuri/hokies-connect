import { supabase } from './supabase'

// Complete alumni data from the text file - all 30 alumni
const alumniData = [
  {
    name: "Aanya Kapoor",
    graduation_year: "2020",
    current_position: "Software Engineer",
    company: "Microsoft",
    location: "Seattle, WA",
    majors: ["Computer Science"],
    contact_info: {
      email: "aanya.kapoor@microsoft.com",
      linkedin: "linkedin.com/in/aanya-kapoor",
      website: ""
    }
  },
  {
    name: "Ben Carter",
    graduation_year: "2019",
    current_position: "Data Analytics Consultant",
    company: "Accenture",
    location: "New York, NY",
    majors: ["Computer Engineering"],
    contact_info: {
      email: "ben.carter@accenture.com",
      linkedin: "linkedin.com/in/ben-carter",
      website: ""
    }
  },
  {
    name: "Chloe Martinez",
    graduation_year: "2021",
    current_position: "Financial Services Analyst",
    company: "JPMorgan Chase",
    location: "New York, NY",
    majors: ["Mechanical Engineering"],
    contact_info: {
      email: "chloe.martinez@jpmorgan.com",
      linkedin: "linkedin.com/in/chloe-martinez",
      website: ""
    }
  },
  {
    name: "Devin Brooks",
    graduation_year: "2018",
    current_position: "Cybersecurity Engineer",
    company: "Cisco",
    location: "San Jose, CA",
    majors: ["Electrical Engineering"],
    contact_info: {
      email: "devin.brooks@cisco.com",
      linkedin: "linkedin.com/in/devin-brooks",
      website: ""
    }
  },
  {
    name: "Emma Zhao",
    graduation_year: "2022",
    current_position: "Automotive Engineer",
    company: "Tesla",
    location: "Fremont, CA",
    majors: ["Industrial & Systems Engineering"],
    contact_info: {
      email: "emma.zhao@tesla.com",
      linkedin: "linkedin.com/in/emma-zhao",
      website: ""
    }
  },
  {
    name: "Farhan Qureshi",
    graduation_year: "2020",
    current_position: "Software Engineer",
    company: "Snowflake",
    location: "San Mateo, CA",
    majors: ["Aerospace Engineering"],
    contact_info: {
      email: "farhan.qureshi@snowflake.com",
      linkedin: "linkedin.com/in/farhan-qureshi",
      website: ""
    }
  },
  {
    name: "Grace Thompson",
    graduation_year: "2019",
    current_position: "Data Analytics Consultant",
    company: "Deloitte",
    location: "Washington, DC",
    majors: ["Civil Engineering"],
    contact_info: {
      email: "grace.thompson@deloitte.com",
      linkedin: "linkedin.com/in/grace-thompson",
      website: ""
    }
  },
  {
    name: "Hassan Ali",
    graduation_year: "2021",
    current_position: "Financial Services Analyst",
    company: "JPMorgan Chase",
    location: "New York, NY",
    majors: ["Chemical Engineering"],
    contact_info: {
      email: "hassan.ali@jpmorgan.com",
      linkedin: "linkedin.com/in/hassan-ali",
      website: ""
    }
  },
  {
    name: "Isabella Rossi",
    graduation_year: "2020",
    current_position: "Cybersecurity Analyst",
    company: "CrowdStrike",
    location: "Austin, TX",
    majors: ["Statistics"],
    contact_info: {
      email: "isabella.rossi@crowdstrike.com",
      linkedin: "linkedin.com/in/isabella-rossi",
      website: ""
    }
  },
  {
    name: "Jaden Nguyen",
    graduation_year: "2022",
    current_position: "Automotive Engineer",
    company: "Ford Motor Company",
    location: "Dearborn, MI",
    majors: ["Computational Modeling & Data Analytics (CMDA)"],
    contact_info: {
      email: "jaden.nguyen@ford.com",
      linkedin: "linkedin.com/in/jaden-nguyen",
      website: ""
    }
  },
  {
    name: "Kiara Patel",
    graduation_year: "2021",
    current_position: "Software Engineer",
    company: "Datadog",
    location: "New York, NY",
    majors: ["Finance"],
    contact_info: {
      email: "kiara.patel@datadog.com",
      linkedin: "linkedin.com/in/kiara-patel",
      website: ""
    }
  },
  {
    name: "Liam O'Connor",
    graduation_year: "2019",
    current_position: "Data Analytics Engineer",
    company: "Salesforce",
    location: "San Francisco, CA",
    majors: ["Business Information Technology"],
    contact_info: {
      email: "liam.oconnor@salesforce.com",
      linkedin: "linkedin.com/in/liam-oconnor",
      website: ""
    }
  },
  {
    name: "Mia Hernandez",
    graduation_year: "2020",
    current_position: "Financial Services Analyst",
    company: "JPMorgan Chase",
    location: "New York, NY",
    majors: ["Economics"],
    contact_info: {
      email: "mia.hernandez@jpmorgan.com",
      linkedin: "linkedin.com/in/mia-hernandez",
      website: ""
    }
  },
  {
    name: "Noah Williams",
    graduation_year: "2021",
    current_position: "Cybersecurity Engineer",
    company: "Palo Alto Networks",
    location: "Santa Clara, CA",
    majors: ["Management"],
    contact_info: {
      email: "noah.williams@paloaltonetworks.com",
      linkedin: "linkedin.com/in/noah-williams",
      website: ""
    }
  },
  {
    name: "Olivia Chen",
    graduation_year: "2022",
    current_position: "Automotive Engineer",
    company: "General Motors",
    location: "Detroit, MI",
    majors: ["Cybersecurity Management & Analytics"],
    contact_info: {
      email: "olivia.chen@gm.com",
      linkedin: "linkedin.com/in/olivia-chen",
      website: ""
    }
  },
  {
    name: "Pranav Desai",
    graduation_year: "2019",
    current_position: "Software Engineer",
    company: "Palantir",
    location: "Denver, CO",
    majors: ["Computer Science"],
    contact_info: {
      email: "pranav.desai@palantir.com",
      linkedin: "linkedin.com/in/pranav-desai",
      website: ""
    }
  },
  {
    name: "Quinn Baker",
    graduation_year: "2021",
    current_position: "Data Analytics Engineer",
    company: "NVIDIA",
    location: "Santa Clara, CA",
    majors: ["Computer Engineering"],
    contact_info: {
      email: "quinn.baker@nvidia.com",
      linkedin: "linkedin.com/in/quinn-baker",
      website: ""
    }
  },
  {
    name: "Riya Singh",
    graduation_year: "2020",
    current_position: "Financial Services Analyst",
    company: "JPMorgan Chase",
    location: "New York, NY",
    majors: ["Mechanical Engineering"],
    contact_info: {
      email: "riya.singh@jpmorgan.com",
      linkedin: "linkedin.com/in/riya-singh",
      website: ""
    }
  },
  {
    name: "Samuel Johnson",
    graduation_year: "2018",
    current_position: "Cybersecurity Engineer",
    company: "Booz Allen Hamilton",
    location: "McLean, VA",
    majors: ["Electrical Engineering"],
    contact_info: {
      email: "samuel.johnson@boozallen.com",
      linkedin: "linkedin.com/in/samuel-johnson",
      website: ""
    }
  },
  {
    name: "Tara Gupta",
    graduation_year: "2022",
    current_position: "Automotive Engineer",
    company: "Rivian",
    location: "Irvine, CA",
    majors: ["Industrial & Systems Engineering"],
    contact_info: {
      email: "tara.gupta@rivian.com",
      linkedin: "linkedin.com/in/tara-gupta",
      website: ""
    }
  },
  {
    name: "Uriel Flores",
    graduation_year: "2021",
    current_position: "Software Engineer",
    company: "Amazon",
    location: "Seattle, WA",
    majors: ["Aerospace Engineering"],
    contact_info: {
      email: "uriel.flores@amazon.com",
      linkedin: "linkedin.com/in/uriel-flores",
      website: ""
    }
  },
  {
    name: "Valerie Kim",
    graduation_year: "2019",
    current_position: "Data Analytics Consultant",
    company: "IBM",
    location: "Armonk, NY",
    majors: ["Civil Engineering"],
    contact_info: {
      email: "valerie.kim@ibm.com",
      linkedin: "linkedin.com/in/valerie-kim",
      website: ""
    }
  },
  {
    name: "Wyatt Turner",
    graduation_year: "2020",
    current_position: "Financial Services Analyst",
    company: "JPMorgan Chase",
    location: "New York, NY",
    majors: ["Chemical Engineering"],
    contact_info: {
      email: "wyatt.turner@jpmorgan.com",
      linkedin: "linkedin.com/in/wyatt-turner",
      website: ""
    }
  },
  {
    name: "Xavier Lewis",
    graduation_year: "2021",
    current_position: "Cybersecurity Engineer",
    company: "Cisco",
    location: "San Jose, CA",
    majors: ["Statistics"],
    contact_info: {
      email: "xavier.lewis@cisco.com",
      linkedin: "linkedin.com/in/xavier-lewis",
      website: ""
    }
  },
  {
    name: "Yara Mohammed",
    graduation_year: "2022",
    current_position: "Automotive Engineer",
    company: "Tesla",
    location: "Fremont, CA",
    majors: ["Computational Modeling & Data Analytics (CMDA)"],
    contact_info: {
      email: "yara.mohammed@tesla.com",
      linkedin: "linkedin.com/in/yara-mohammed",
      website: ""
    }
  },
  {
    name: "Zane Parker",
    graduation_year: "2020",
    current_position: "Software Engineer",
    company: "Google",
    location: "Mountain View, CA",
    majors: ["Finance"],
    contact_info: {
      email: "zane.parker@google.com",
      linkedin: "linkedin.com/in/zane-parker",
      website: ""
    }
  },
  {
    name: "Aarav Shah",
    graduation_year: "2019",
    current_position: "Data Analytics Engineer",
    company: "Bloomberg",
    location: "New York, NY",
    majors: ["Business Information Technology"],
    contact_info: {
      email: "aarav.shah@bloomberg.com",
      linkedin: "linkedin.com/in/aarav-shah",
      website: ""
    }
  },
  {
    name: "Bella Rivera",
    graduation_year: "2021",
    current_position: "Financial Services Analyst",
    company: "JPMorgan Chase",
    location: "New York, NY",
    majors: ["Economics"],
    contact_info: {
      email: "bella.rivera@jpmorgan.com",
      linkedin: "linkedin.com/in/bella-rivera",
      website: ""
    }
  },
  {
    name: "Cameron Lee",
    graduation_year: "2020",
    current_position: "Cybersecurity Analyst",
    company: "CrowdStrike",
    location: "Austin, TX",
    majors: ["Management"],
    contact_info: {
      email: "cameron.lee@crowdstrike.com",
      linkedin: "linkedin.com/in/cameron-lee",
      website: ""
    }
  },
  {
    name: "Diana Popov",
    graduation_year: "2022",
    current_position: "Automotive Engineer",
    company: "Ford Motor Company",
    location: "Dearborn, MI",
    majors: ["Cybersecurity Management & Analytics"],
    contact_info: {
      email: "diana.popov@ford.com",
      linkedin: "linkedin.com/in/diana-popov",
      website: ""
    }
  }
]

// Function to populate alumni profiles
export const populateAlumniProfiles = async () => {
  try {
    console.log('Starting to populate alumni profiles...')
    
    // Generate user IDs for each alumni
    const alumniProfiles = alumniData.map(alumni => ({
      user_id: `alumni_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: alumni.name,
      graduation_year: alumni.graduation_year,
      current_position: alumni.current_position,
      company: alumni.company,
      location: alumni.location,
      majors: alumni.majors,
      contact_info: alumni.contact_info,
      profile_picture: null
    }))

    // Insert all alumni profiles
    const { data, error } = await supabase
      .from('alumni_profiles')
      .insert(alumniProfiles)

    if (error) {
      console.error('Error inserting alumni profiles:', error)
      return false
    }

    console.log(`Successfully inserted ${alumniProfiles.length} alumni profiles`)
    return true
  } catch (error) {
    console.error('Error populating alumni profiles:', error)
    return false
  }
}

// Function to check if alumni profiles already exist
export const checkAlumniProfilesExist = async () => {
  try {
    const { data, error } = await supabase
      .from('alumni_profiles')
      .select('id')
      .limit(1)

    if (error) throw error
    return data && data.length > 0
  } catch (error) {
    console.error('Error checking alumni profiles:', error)
    return false
  }
}