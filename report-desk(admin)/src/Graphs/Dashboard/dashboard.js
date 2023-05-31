import axios from "axios";
import { WEBURL } from "../../constant/comman";

export async function getDashboardData() {
  try {
    return await axios.get(`${WEBURL}api/v1/auth/admin/kpi`);
  } catch (error) {
    throw error;
  }
}

export async function getGptUsers() {
  try {
    return await axios.get(`http://localhost:4000/api/v1/admin/gptApi`);
  } catch (error) {
    throw error;
  }
}

export async function getGptInfo() {
  try {
    return await axios.get(`http://localhost:4000/api/v1/admin/gptApi`);
  } catch (error) {
    throw error;
  }
}

export const allQuestions=[
  [
    1,
    "Kindly provide me some step for medications",
    ".\n\n1. Follow your doctor's instructions for taking any medications prescribed for your condition.\n\n2. Take medications as prescribed and at the same time each day.\n\n3. Follow a healthy diet and exercise regularly.\n\n4",
    "anurag.shrivastva@gmail.com",
    "Wed, 10 May 2023 00:00:00 GMT"
  ],
  [
    2,
    "Kindly provide me some step for diabetes",
    "1. Eat a healthy diet that includes plenty of fruits, vegetables, whole grains, and lean proteins.\n\n2. Exercise regularly. Aim for at least 30 minutes of physical activity most days of the week.\n\n3. Monitor",
    "anurag.shrivastva@gmail.com",
    "Wed, 10 May 2023 00:00:00 GMT"
  ],
  [
    3,
    "Kindly provide me some medication for heart disease",
    "It is not possible to provide medication for heart disease without first being evaluated by a physician. It is important to speak with a doctor about your specific medical condition and any medications that may be appropriate for you. Some medications commonly used to treat heart",
    "anurag.shrivastva@gmail.com",
    "Wed, 10 May 2023 00:00:00 GMT"
  ],
  [
    4,
    "Kindly provide me some medication for heart disease which is best for out health",
    "There are a number of medications available for heart disease, including ACE inhibitors, beta blockers, calcium channel blockers, nitrates, and diuretics. Your doctor will be able to determine the best medication for you, depending on your specific condition.",
    "anurag.shrivastva@gmail.com",
    "Wed, 10 May 2023 00:00:00 GMT"
  ],
  [
    5,
    "Provide the step for pills",
    "and their families to take to help prevent an overdose\n\n1. Get educated about the risks and signs of an overdose, including the signs of an opioid overdose.\n\n2. Talk to your doctor about the risk of overdose and the signs to look for if it occurs.\n\n3. Learn how to use naloxone, a medication that can reverse an opioid overdose.\n\n4. Store medications safely and securely to prevent others from taking them.\n\n5. Dispose of unused medications properly.\n\n6. Monitor your family member\u2019s medication use and ensure they are taking it as prescribed.\n\n7. Know the signs of an overdose and be prepared to call 911 if you suspect one is occurring.\n\n8. Be aware of your environment and the potential for overdose.\n\n9. Seek help if you or your family member is struggling with substance use disorder.",
    "anurag.shrivastva@gmail.com",
    "Wed, 10 May 2023 00:00:00 GMT"
  ],
  [
    6,
    "what is cancer",
    "?\n\nCancer is a group of diseases involving abnormal cell growth with the potential to invade or spread to other parts of the body. It is a leading cause of death worldwide.",
    "n",
    "Thu, 11 May 2023 00:00:00 GMT"
  ],
  [
    7,
    "what is heart disease???\r\n\r\n",
    "Heart disease is a broad term for a range of conditions that affect the heart. It is a leading cause of death in the United States and worldwide. It includes coronary artery disease, heart attack, cardiac arrest, arrhythmia, congenital heart defects, and other conditions. It can be caused by lifestyle factors such as smoking, poor diet, and lack of exercise, as well as genetic and environmental factors. Treatment options depend on the type of heart disease and may include lifestyle changes, medications, and surgery.",
    "n",
    "Thu, 11 May 2023 00:00:00 GMT"
  ]
]

export const users=[
  [
    1,
    "Anurag",
    "12345",
    "anurag.shrivastva@gmail.com",
    "8127112543",
    "Cloud ANalogy",
    "Wed, 10 May 2023 00:00:00 GMT"
  ]
]
