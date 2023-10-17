type CourseContent = {
  [key: string]: {
    [key: string]: {
      [key: string]: string;
    };
  };
};

const courseContents: CourseContent = {
  "Varibles and constants": {
    "C keywords and identifies": {
      "What are Keywords?":
        "Keywords are predefined or reserved words that have special meanings to the compiler. These are part of the syntax and cannot be used as identifiers in the program. A list of keywords in C or reserved words in the C programming language are mentioned below:",
      "C identifies":
        "C identifiers represent the name in the C program, for example, variables, functions, arrays, structures, unions, labels, etc. An identifier can be composed of letters such as uppercase, lowercase letters, underscore, digits, but the starting letter should be either an alphabet or an underscore. If the identifier is not used in the external linkage, then it is called as an internal identifier. If the identifier is used in the external linkage, then it is called as an external identifier.",
    },
    "C keywords and identifies 1": {
      "What are Keywords?":
        "Keywords are predefined or reserved words that have special meanings to the compiler. These are part of the syntax and cannot be used as identifiers in the program. A list of keywords in C or reserved words in the C programming language are mentioned below:",
      "C identifies":
        "C identifiers represent the name in the C program, for example, variables, functions, arrays, structures, unions, labels, etc. An identifier can be composed of letters such as uppercase, lowercase letters, underscore, digits, but the starting letter should be either an alphabet or an underscore. If the identifier is not used in the external linkage, then it is called as an internal identifier. If the identifier is used in the external linkage, then it is called as an external identifier.",
    },
    "C keywords and identifies 2": {
      "What are Keywords?":
        "Keywords are predefined or reserved words that have special meanings to the compiler. These are part of the syntax and cannot be used as identifiers in the program. A list of keywords in C or reserved words in the C programming language are mentioned below:",
      "C identifies":
        "C identifiers represent the name in the C program, for example, variables, functions, arrays, structures, unions, labels, etc. An identifier can be composed of letters such as uppercase, lowercase letters, underscore, digits, but the starting letter should be either an alphabet or an underscore. If the identifier is not used in the external linkage, then it is called as an internal identifier. If the identifier is used in the external linkage, then it is called as an external identifier.",
    },
  },
  "Varibles and constants 1": {
    "C keywords and identifies": {
      "What are Keywords?":
        "Keywords are predefined or reserved words that have special meanings to the compiler. These are part of the syntax and cannot be used as identifiers in the program. A list of keywords in C or reserved words in the C programming language are mentioned below:",
      "C identifies":
        "C identifiers represent the name in the C program, for example, variables, functions, arrays, structures, unions, labels, etc. An identifier can be composed of letters such as uppercase, lowercase letters, underscore, digits, but the starting letter should be either an alphabet or an underscore. If the identifier is not used in the external linkage, then it is called as an internal identifier. If the identifier is used in the external linkage, then it is called as an external identifier.",
    },
    "C keywords and identifies 1": {
      "What are Keywords?":
        "Keywords are predefined or reserved words that have special meanings to the compiler. These are part of the syntax and cannot be used as identifiers in the program. A list of keywords in C or reserved words in the C programming language are mentioned below:",
      "C identifies":
        "C identifiers represent the name in the C program, for example, variables, functions, arrays, structures, unions, labels, etc. An identifier can be composed of letters such as uppercase, lowercase letters, underscore, digits, but the starting letter should be either an alphabet or an underscore. If the identifier is not used in the external linkage, then it is called as an internal identifier. If the identifier is used in the external linkage, then it is called as an external identifier.",
    },
    "C keywords and identifies 2": {
      "What are Keywords?":
        "Keywords are predefined or reserved words that have special meanings to the compiler. These are part of the syntax and cannot be used as identifiers in the program. A list of keywords in C or reserved words in the C programming language are mentioned below:",
      "C identifies":
        "C identifiers represent the name in the C program, for example, variables, functions, arrays, structures, unions, labels, etc. An identifier can be composed of letters such as uppercase, lowercase letters, underscore, digits, but the starting letter should be either an alphabet or an underscore. If the identifier is not used in the external linkage, then it is called as an internal identifier. If the identifier is used in the external linkage, then it is called as an external identifier.",
    },
  },
  "Varibles and constants 2": {
    "C keywords and identifies": {
      "What are Keywords?":
        "Keywords are predefined or reserved words that have special meanings to the compiler. These are part of the syntax and cannot be used as identifiers in the program. A list of keywords in C or reserved words in the C programming language are mentioned below:",
      "C identifies":
        "C identifiers represent the name in the C program, for example, variables, functions, arrays, structures, unions, labels, etc. An identifier can be composed of letters such as uppercase, lowercase letters, underscore, digits, but the starting letter should be either an alphabet or an underscore. If the identifier is not used in the external linkage, then it is called as an internal identifier. If the identifier is used in the external linkage, then it is called as an external identifier.",
    },
    "C keywords and identifies 1": {
      "What are Keywords?":
        "Keywords are predefined or reserved words that have special meanings to the compiler. These are part of the syntax and cannot be used as identifiers in the program. A list of keywords in C or reserved words in the C programming language are mentioned below:",
      "C identifies":
        "C identifiers represent the name in the C program, for example, variables, functions, arrays, structures, unions, labels, etc. An identifier can be composed of letters such as uppercase, lowercase letters, underscore, digits, but the starting letter should be either an alphabet or an underscore. If the identifier is not used in the external linkage, then it is called as an internal identifier. If the identifier is used in the external linkage, then it is called as an external identifier.",
    },
    "C keywords and identifies 2": {
      "What are Keywords?":
        "Keywords are predefined or reserved words that have special meanings to the compiler. These are part of the syntax and cannot be used as identifiers in the program. A list of keywords in C or reserved words in the C programming language are mentioned below:",
      "C identifies":
        "C identifiers represent the name in the C program, for example, variables, functions, arrays, structures, unions, labels, etc. An identifier can be composed of letters such as uppercase, lowercase letters, underscore, digits, but the starting letter should be either an alphabet or an underscore. If the identifier is not used in the external linkage, then it is called as an internal identifier. If the identifier is used in the external linkage, then it is called as an external identifier.",
    },
  },
};

export const Course = ({ course, ep = 0 }: { course: string; ep: number }) => (
  <section class="lg:h-100vh py-6rem px-[min(7vw,4rem)] lg:flex flex-row-reverse gap-4">
    <div class="grow lg:overflow-y-auto">
      <video
        src="/video"
        controls="true"
        class="aspect-ratio-[5/2] w-full"
      ></video>
      <br />
      <article class="glow p-4 rd-lg duration-200 bg-glass">
        <h3 class="text-5 font-bold">{Object.keys(courseContents)[ep]}</h3>
      </article>
    </div>
    <br />
    <aside class="b-text b-0 lg:border-r lg:pr-8 b-solid">
      <h3 class="text-5 font-bold capitalize">{course}</h3>
      {Object.keys(courseContents).map((topic) => (
        <>
          <h4 class="ml-4 whitespace-nowrap overflow-x-hidden text-ellipsis">
            {topic}
          </h4>
          {Object.keys(courseContents[topic]).map((subTopic) => (
            <p class="ml-8 whitespace-nowrap overflow-x-hidden text-ellipsis">
              {subTopic}
            </p>
          ))}
        </>
      ))}
    </aside>
  </section>
);