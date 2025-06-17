export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const timeTable = {
  Monday: {
    totalLectures: 4,
    lectures: [
      {
        subject: "Mathematics",
        subjectCode: "MATH101",
        from: "09:00 AM",
        till: "10:00 AM",
        instructor: "Dr. A. Kumar",
        eid: "E001",
        type: "Lecture",
        blockNo: "B1",
        roomNo: "101"
      },
      {
        subject: "Physics",
        subjectCode: "PHY102",
        from: "10:15 AM",
        till: "11:15 AM",
        instructor: "Prof. B. Sharma",
        eid: "E002",
        type: "Lecture",
        blockNo: "B1",
        roomNo: "102"
      },
      {
        subject: "English",
        subjectCode: "ENG103",
        from: "11:30 AM",
        till: "12:30 PM",
        instructor: "Ms. C. Verma",
        eid: "E003",
        type: "Tutorial",
        blockNo: "B2",
        roomNo: "203"
      },
      {
        subject: "Computer Science",
        subjectCode: "CS104",
        from: "01:30 PM",
        till: "02:30 PM",
        instructor: "Mr. D. Singh",
        eid: "E004",
        type: "Practical",
        blockNo: "Lab Block",
        roomNo: "Lab-1"
      }
    ]
  },

  Tuesday: {
    totalLectures: 3,
    lectures: [
      {
        subject: "Chemistry",
        subjectCode: "CHEM105",
        from: "09:00 AM",
        till: "10:00 AM",
        instructor: "Dr. E. Khan",
        eid: "E005",
        type: "Lecture",
        blockNo: "B1",
        roomNo: "103"
      },
      {
        subject: "Mathematics",
        subjectCode: "MATH101",
        from: "10:15 AM",
        till: "08:15 PM",
        instructor: "Dr. A. Kumar",
        eid: "E006",
        type: "Tutorial",
        blockNo: "B2",
        roomNo: "204"
      },
      {
        subject: "Environmental Science",
        subjectCode: "EVS106",
        from: "11:30 PM",
        till: "10:30 PM",
        instructor: "Ms. F. Mehta",
        eid: "E007",
        type: "Lecture",
        blockNo: "B3",
        roomNo: "305"
      }
    ]
  },

  Wednesday: {
    totalLectures: 2,
    lectures: [
      {
        subject: "Physics Lab",
        subjectCode: "PHY102L",
        from: "01:00 AM",
        till: "11:00 AM",
        instructor: "Lab Asst. G. Iyer",
        eid: "E008",
        type: "Practical",
        blockNo: "Lab Block",
        roomNo: "Lab-3"
      },
      {
        subject: "English",
        subjectCode: "ENG103",
        from: "11:15 AM",
        till: "12:15 PM",
        instructor: "Ms. C. Verma",
        eid: "E009",
        type: "Lecture",
        blockNo: "B2",
        roomNo: "205"
      }
    ]
  },

  Thursday: {
    totalLectures: 4,
    lectures: [
      {
        subject: "Mathematics",
        subjectCode: "MATH101",
        from: "09:00 AM",
        till: "10:00 AM",
        instructor: "Dr. A. Kumar",
        eid: "E010",
        type: "Lecture",
        blockNo: "B1",
        roomNo: "101"
      },
      {
        subject: "Chemistry",
        subjectCode: "CHEM105",
        from: "10:15 AM",
        till: "11:15 AM",
        instructor: "Dr. E. Khan",
        eid: "E011",
        type: "Lecture",
        blockNo: "B1",
        roomNo: "103"
      },
      {
        subject: "Computer Science",
        subjectCode: "CS104",
        from: "11:30 AM",
        till: "12:30 PM",
        instructor: "Mr. D. Singh",
        eid: "E012",
        type: "Tutorial",
        blockNo: "B2",
        roomNo: "206"
      },
      {
        subject: "Environmental Science",
        subjectCode: "EVS106",
        from: "01:30 PM",
        till: "02:30 PM",
        instructor: "Ms. F. Mehta",
        eid: "E013",
        type: "Lecture",
        blockNo: "B3",
        roomNo: "306"
      }
    ]
  },

  Friday: {
    totalLectures: 3,
    lectures: [
      {
        subject: "Computer Science",
        subjectCode: "CS104",
        from: "09:00 AM",
        till: "10:00 AM",
        instructor: "Mr. D. Singh",
        eid: "E014",
        type: "Lecture",
        blockNo: "B1",
        roomNo: "104"
      },
      {
        subject: "Physics",
        subjectCode: "PHY102",
        from: "10:15 AM",
        till: "11:15 AM",
        instructor: "Prof. B. Sharma",
        eid: "E015",
        type: "Tutorial",
        blockNo: "B2",
        roomNo: "207"
      },
      {
        subject: "Mathematics",
        subjectCode: "MATH101",
        from: "11:30 AM",
        till: "12:30 PM",
        instructor: "Dr. A. Kumar",
        eid: "E016",
        type: "Lecture",
        blockNo: "B1",
        roomNo: "101"
      }
    ]
  },

  Saturday: {
    totalLectures: 2,
    lectures: [
      {
        subject: "English",
        subjectCode: "ENG103",
        from: "09:00 AM",
        till: "10:00 AM",
        instructor: "Ms. C. Verma",
        eid: "E017",
        type: "Tutorial",
        blockNo: "B2",
        roomNo: "208"
      },
      {
        subject: "Workshop",
        subjectCode: "WS107",
        from: "10:15 AM",
        till: "12:15 PM",
        instructor: "Mr. H. Rao",
        eid: "E018",
        type: "Practical",
        blockNo: "Workshop Block",
        roomNo: "W-1"
      }
    ]
  },

  Sunday: {
    totalLectures: 0,
    lectures: []
  }
};