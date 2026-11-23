export interface GenderQuestionExplanation {
  sourceNumber: number;
  concept: string;
  explanation: string;
  lectureReference: string;
  studyNote?: string;
}

const EXP_SEX_VS_GENDER =
  'The lecture distinguishes sex from gender: sex is presented as biological, while gender refers to socially and culturally prescribed behaviours, actions and roles associated with a sex. The slides also describe gender as fluid and socially constructed or negotiated. The key therefore points to the social dimension of gender, not biology.';

const EXP_EQUALITY =
  'The slides define gender equality as the freedom of all people, women and men, to develop their abilities and make choices without stereotypes, rigid gender roles or prejudice. Equality does not require everyone to become the same; it means rights, responsibilities and opportunities should not depend on being born male or female.';

const EXP_EQUITY =
  "Gender equity is fairness of treatment according to the respective needs of women and men. The lecture notes that equitable treatment may be different in form while being equal in rights, benefits, obligations and opportunities. The shoe example illustrates matching support to a person's need (shoe size), rather than giving everyone an identical item. The slides state that equity leads to equality.";

const EXP_SOCIAL_CONSTRUCTION_FRAME =
  'The lecture frames this issue through the social construction of gender and the unequal distribution of roles, resources, power and opportunities. The selected answer is consistent with the stated lecture point; review the cited slide range to connect the definition or example to the wider topic.';

const EXP_PATRIARCHY =
  'The lecture defines patriarchy as a social system in which men, especially fathers, occupy central positions of authority over women, children, other men and property. It is sustained through institutions and male privilege, and may persist even where inheritance is matrilineal. The key should be understood as describing a social arrangement, not a biological inevitability.';

const EXP_STEREOTYPES =
  "A gender stereotype is a broad, simplified assumption about how women or men supposedly behave or what qualities they possess. Statements such as 'women are gossips' or 'men are cheats' assign traits to people because of gender and ignore individual differences. The lecture identifies myths and stereotypes as elements that shape unequal gender relations.";

const EXP_AFFIRMATIVE_ACTION =
  'Affirmative action is defined in the slides as a set of temporary measures used by governments and public or private institutions to address historical or systemic discrimination and exclusion. The lecture distinguishes direct and indirect measures and gives examples such as quotas, reserved seats, targeted education support and scholarships. It also notes that quotas are more effective when backed by law and when practical barriers to participation are removed.';

const EXP_DISCRIMINATION_RESPONSES =
  "The lecture argues that discrimination does not correct itself; it tends to reproduce unequal outcomes. Responses include improving educational access, women's access to credit and political participation, constitutional and legal protections, civil-society advocacy and affirmative action. An option that excludes women from decision-making runs against these aims.";

const EXP_JUSTIFICATIONS =
  'The lecture gives three justifications for addressing gender inequality: development imperatives, citizenship rights and constitutional equality, and the creation of gender-equitable cultures. These connect gender equality with sustainable, people-centred development, equal rights and the removal of discriminatory practices. An option outside these stated justifications is therefore the exception.';

const EXP_INTERNATIONAL_RESPONSES =
  "The slides identify four world conferences—Mexico City, Copenhagen, Nairobi and Beijing—and CEDAW, adopted in 1979, as international responses. They also list the Beijing Platform for Action, Millennium Development Goals 1, 3 and 5, Sustainable Development Goal 5 and the African Charter on Human and Peoples' Rights. The answer follows the specific date, place or agreement named in that lecture list.";

const EXP_STATE_RESPONSES =
  "The lecture separates state responses into constitutional guarantees, legal reforms and policy reforms. It identifies constitutional protections against discrimination (Articles 17.1–17.3) and the State's duty to integrate women into economic development (Article 35.6). It also lists the Intestate Succession Law, Criminal Code amendments, Human Trafficking Act and Domestic Violence Act as legal reforms, while policies such as Girl-Child Education and maternity leave are policy responses. Use the category carefully: a strategy or policy is not itself a statute.";

const EXP_MASCULINITIES =
  "The slides explain that masculinity is a collective gender identity, not a natural attribute. It is socially constructed, fluid and varied across contexts and can change over time. Hegemonic masculinity is the dominant form that defines expectations of how 'real men' should behave and can silence or ridicule other masculinities.";

const EXP_ELEMENTS_OF_RELATIONS =
  'The lecture lists division of labour, productive and reproductive roles, control of resources, gender ideologies, myths and stereotypes as elements of gender relations. These elements influence who performs work, who controls resources and whose contributions are valued.';

const EXP_PRODUCTIVE_REPRODUCTIVE =
  "The slides distinguish productive work from reproductive work and note that gender relations often undervalue work associated with women while valuing men's roles more highly. Reproductive roles are socially assigned and should not be treated as a natural limit on women's participation in productive work. The question should be read in the context of this gendered division of labour.";

const EXP_INDIVIDUAL_AGENCY =
  "Individual agency refers to a person's capacity to act consciously to change or challenge their circumstances. The slides give examples such as taking legal action, opposing discriminatory practices, leaving an abusive relationship and learning new skills. Seeking help or choosing how to report an incident does not automatically mean a person lacks agency.";

const EXP_CIVIL_SOCIETY =
  "Civil society action comes from organisations and associations operating between individuals or families and the state. The lecture gives labour unions, professional associations, women's organisations, youth and student groups, religious and business organisations as examples. Their actions can mobilise people, advocate for rights and influence public decisions; they are distinct from direct state legislation or policy.";

const EXP_GROUP_AGENCY =
  "Agency means people are not passive: they can act consciously to change their circumstances. Group agency involves collective action, such as women's self-help groups, microfinance or susu groups, cooperatives and widows' support groups. It differs from an individual acting alone, because people organise and support one another.";

const EXP_WORKPLACE_ROLES =
  "Gender roles are socially prescribed expectations, not simply biological instructions. The slides explain that the division of labour assigns productive and reproductive responsibilities and often undervalues women's work. Such expectations can operate both at home and in institutions, including workplaces.";

const EXP_SOCIALISATION_CULTURE =
  'The lecture explains that gender matters in African societies because social and cultural practices shape marriage, inheritance, family responsibilities, reproductive-health decisions and access to power. Socialisation through family, church, school, media and work reinforces gender relations. The slides also identify law and the relationship between customary and state laws as important factors.';

const CONCEPT_SEX_VS_GENDER = 'Biological Sex vs. Socially Constructed Gender';
const CONCEPT_EQUALITY = 'Gender Equality & Freedom of Choice';
const CONCEPT_EQUITY = 'Gender Equity & Fairness by Need';
const CONCEPT_SOCIAL_CONSTRUCTION = 'Social Construction, Power & Unequal Distribution';
const CONCEPT_PATRIARCHY = 'Patriarchy as an Institutional Social System';
const CONCEPT_STEREOTYPES = 'Gender Stereotypes, Myths & Bias';
const CONCEPT_AFFIRMATIVE_ACTION = 'Affirmative Action (Direct & Indirect Measures)';
const CONCEPT_DISCRIMINATION = 'Self-Perpetuating Discrimination & Corrective Responses';
const CONCEPT_JUSTIFICATIONS = 'Justifications for Addressing Gender Inequality';
const CONCEPT_INTERNATIONAL = 'International Frameworks & UN World Conferences';
const CONCEPT_STATE_RESPONSES = 'State Responses: Constitutional, Legal & Policy Reforms';
const CONCEPT_MASCULINITIES = 'Masculinities & Hegemonic Masculinity';
const CONCEPT_ELEMENTS = 'Elements of Gender Relations';
const CONCEPT_DIVISION_OF_LABOUR = 'Gendered Division of Labour (Productive vs. Reproductive Roles)';
const CONCEPT_INDIVIDUAL_AGENCY = 'Individual Agency & Self-Conscious Action';
const CONCEPT_CIVIL_SOCIETY = 'Civil Society Action & Non-State Advocacy';
const CONCEPT_GROUP_AGENCY = 'Group Agency & Collective Empowerment';
const CONCEPT_WORKPLACE_ROLES = 'Gender Roles at Home & in Institutions';
const CONCEPT_SOCIALISATION = 'Gender Socialisation, Cultural Practices & Law';

export const GENDER_EXPLANATION_SCOPE_NOTE =
  'Questions 1–158 (Introduction to Gender) are paired with lecture-slide explanations from the Introduction to Gender revision guide. Questions 159–170 move into additional topics and named African Studies readings not covered in those slides.';

export const GENDER_EXPLANATIONS: Record<number, GenderQuestionExplanation> = {
  1: {
    sourceNumber: 1,
    concept: CONCEPT_SEX_VS_GENDER,
    explanation: EXP_SEX_VS_GENDER,
    lectureReference: 'Slide(s) 5.',
  },
  2: {
    sourceNumber: 2,
    concept: CONCEPT_EQUALITY,
    explanation: EXP_EQUALITY,
    lectureReference: 'Slide(s) 6–7.',
  },
  3: {
    sourceNumber: 3,
    concept: CONCEPT_SEX_VS_GENDER,
    explanation: EXP_SEX_VS_GENDER,
    lectureReference: 'Slide(s) 5.',
  },
  4: {
    sourceNumber: 4,
    concept: CONCEPT_SOCIAL_CONSTRUCTION,
    explanation: EXP_SOCIAL_CONSTRUCTION_FRAME,
    lectureReference: 'Slide(s) 5, 21–22, 25–29.',
  },
  5: {
    sourceNumber: 5,
    concept: CONCEPT_SEX_VS_GENDER,
    explanation: EXP_SEX_VS_GENDER,
    lectureReference: 'Slide(s) 5.',
  },
  6: {
    sourceNumber: 6,
    concept: CONCEPT_EQUITY,
    explanation: EXP_EQUITY,
    lectureReference: 'Slide(s) 8.',
  },
  7: {
    sourceNumber: 7,
    concept: CONCEPT_SEX_VS_GENDER,
    explanation: EXP_SEX_VS_GENDER,
    lectureReference: 'Slide(s) 5.',
  },
  8: {
    sourceNumber: 8,
    concept: CONCEPT_SOCIAL_CONSTRUCTION,
    explanation: EXP_SOCIAL_CONSTRUCTION_FRAME,
    lectureReference: 'Slide(s) 5, 21–22, 25–29.',
  },
  9: {
    sourceNumber: 9,
    concept: CONCEPT_PATRIARCHY,
    explanation: EXP_PATRIARCHY,
    lectureReference: 'Slide(s) 15–16.',
  },
  10: {
    sourceNumber: 10,
    concept: CONCEPT_SOCIAL_CONSTRUCTION,
    explanation: EXP_SOCIAL_CONSTRUCTION_FRAME,
    lectureReference: 'Slide(s) 5, 21–22, 25–29.',
  },
  11: {
    sourceNumber: 11,
    concept: CONCEPT_EQUITY,
    explanation: EXP_EQUITY,
    lectureReference: 'Slide(s) 8.',
  },
  12: {
    sourceNumber: 12,
    concept: CONCEPT_STEREOTYPES,
    explanation: EXP_STEREOTYPES,
    lectureReference: 'Slide(s) 4, 22.',
  },
  13: {
    sourceNumber: 13,
    concept: CONCEPT_EQUITY,
    explanation: EXP_EQUITY,
    lectureReference: 'Slide(s) 8.',
  },
  14: {
    sourceNumber: 14,
    concept: CONCEPT_AFFIRMATIVE_ACTION,
    explanation: EXP_AFFIRMATIVE_ACTION,
    lectureReference: 'Slide(s) 35–39.',
  },
  15: {
    sourceNumber: 15,
    concept: CONCEPT_DISCRIMINATION,
    explanation: EXP_DISCRIMINATION_RESPONSES,
    lectureReference: 'Slide(s) 25–29, 39–40.',
  },
  16: {
    sourceNumber: 16,
    concept: CONCEPT_JUSTIFICATIONS,
    explanation: EXP_JUSTIFICATIONS,
    lectureReference: 'Slide(s) 25.',
  },
  17: {
    sourceNumber: 17,
    concept: CONCEPT_INTERNATIONAL,
    explanation: EXP_INTERNATIONAL_RESPONSES,
    lectureReference: 'Slide(s) 26.',
  },
  18: {
    sourceNumber: 18,
    concept: CONCEPT_STATE_RESPONSES,
    explanation: EXP_STATE_RESPONSES,
    lectureReference: 'Slide(s) 27–29.',
  },
  19: {
    sourceNumber: 19,
    concept: CONCEPT_STATE_RESPONSES,
    explanation: EXP_STATE_RESPONSES,
    lectureReference: 'Slide(s) 27–29.',
  },
  20: {
    sourceNumber: 20,
    concept: CONCEPT_EQUITY,
    explanation: EXP_EQUITY,
    lectureReference: 'Slide(s) 8.',
  },
  21: {
    sourceNumber: 21,
    concept: CONCEPT_EQUALITY,
    explanation: EXP_EQUALITY,
    lectureReference: 'Slide(s) 6–7.',
  },
  22: {
    sourceNumber: 22,
    concept: CONCEPT_INTERNATIONAL,
    explanation: EXP_INTERNATIONAL_RESPONSES,
    lectureReference: 'Slide(s) 26.',
  },
  23: {
    sourceNumber: 23,
    concept: CONCEPT_SEX_VS_GENDER,
    explanation: EXP_SEX_VS_GENDER,
    lectureReference: 'Slide(s) 5.',
  },
  24: {
    sourceNumber: 24,
    concept: CONCEPT_STEREOTYPES,
    explanation: EXP_STEREOTYPES,
    lectureReference: 'Slide(s) 4, 22.',
  },
  25: {
    sourceNumber: 25,
    concept: CONCEPT_INTERNATIONAL,
    explanation: EXP_INTERNATIONAL_RESPONSES,
    lectureReference: 'Slide(s) 26.',
  },
  26: {
    sourceNumber: 26,
    concept: CONCEPT_EQUALITY,
    explanation: EXP_EQUALITY,
    lectureReference: 'Slide(s) 6–7.',
  },
  27: {
    sourceNumber: 27,
    concept: CONCEPT_STATE_RESPONSES,
    explanation: EXP_STATE_RESPONSES,
    lectureReference: 'Slide(s) 27–29.',
  },
  28: {
    sourceNumber: 28,
    concept: CONCEPT_STATE_RESPONSES,
    explanation: EXP_STATE_RESPONSES,
    lectureReference: 'Slide(s) 27–29.',
  },
  29: {
    sourceNumber: 29,
    concept: CONCEPT_MASCULINITIES,
    explanation: EXP_MASCULINITIES,
    lectureReference: 'Slide(s) 17–19.',
  },
  30: {
    sourceNumber: 30,
    concept: CONCEPT_ELEMENTS,
    explanation: EXP_ELEMENTS_OF_RELATIONS,
    lectureReference: 'Slide(s) 21–22.',
  },
  31: {
    sourceNumber: 31,
    concept: CONCEPT_STATE_RESPONSES,
    explanation: EXP_STATE_RESPONSES,
    lectureReference: 'Slide(s) 27–29.',
  },
  32: {
    sourceNumber: 32,
    concept: CONCEPT_STATE_RESPONSES,
    explanation: EXP_STATE_RESPONSES,
    lectureReference: 'Slide(s) 27–29.',
  },
  33: {
    sourceNumber: 33,
    concept: CONCEPT_STATE_RESPONSES,
    explanation: EXP_STATE_RESPONSES,
    lectureReference: 'Slide(s) 27–29.',
  },
  34: {
    sourceNumber: 34,
    concept: CONCEPT_STATE_RESPONSES,
    explanation: EXP_STATE_RESPONSES,
    lectureReference: 'Slide(s) 27–29.',
  },
  35: {
    sourceNumber: 35,
    concept: CONCEPT_DISCRIMINATION,
    explanation: EXP_DISCRIMINATION_RESPONSES,
    lectureReference: 'Slide(s) 25–29, 39–40.',
  },
  36: {
    sourceNumber: 36,
    concept: CONCEPT_DIVISION_OF_LABOUR,
    explanation: EXP_PRODUCTIVE_REPRODUCTIVE,
    lectureReference: 'Slide(s) 21.',
  },
  37: {
    sourceNumber: 37,
    concept: CONCEPT_SEX_VS_GENDER,
    explanation: EXP_SEX_VS_GENDER,
    lectureReference: 'Slide(s) 5.',
  },
  38: {
    sourceNumber: 38,
    concept: CONCEPT_AFFIRMATIVE_ACTION,
    explanation: EXP_AFFIRMATIVE_ACTION,
    lectureReference: 'Slide(s) 35–39.',
  },
  39: {
    sourceNumber: 39,
    concept: CONCEPT_DISCRIMINATION,
    explanation: EXP_DISCRIMINATION_RESPONSES,
    lectureReference: 'Slide(s) 25–29, 39–40.',
  },
  40: {
    sourceNumber: 40,
    concept: CONCEPT_AFFIRMATIVE_ACTION,
    explanation: EXP_AFFIRMATIVE_ACTION,
    lectureReference: 'Slide(s) 35–39.',
    studyNote:
      "The slide deck mentions South Africa in connection with affirmative action after Apartheid, but it does not explicitly establish that South Africa was the first African country to use it. Treat the keyed answer as the question-book's answer, not as a fact independently demonstrated by these slides.",
  },
  41: {
    sourceNumber: 41,
    concept: CONCEPT_EQUALITY,
    explanation: EXP_EQUALITY,
    lectureReference: 'Slide(s) 6–7.',
  },
  42: {
    sourceNumber: 42,
    concept: CONCEPT_EQUALITY,
    explanation: EXP_EQUALITY,
    lectureReference: 'Slide(s) 6–7.',
  },
  43: {
    sourceNumber: 43,
    concept: CONCEPT_SOCIAL_CONSTRUCTION,
    explanation: EXP_SOCIAL_CONSTRUCTION_FRAME,
    lectureReference: 'Slide(s) 5, 21–22, 25–29.',
  },
  44: {
    sourceNumber: 44,
    concept: CONCEPT_SOCIAL_CONSTRUCTION,
    explanation: EXP_SOCIAL_CONSTRUCTION_FRAME,
    lectureReference: 'Slide(s) 5, 21–22, 25–29.',
  },
  45: {
    sourceNumber: 45,
    concept: CONCEPT_INDIVIDUAL_AGENCY,
    explanation: EXP_INDIVIDUAL_AGENCY,
    lectureReference: 'Slide(s) 34.',
  },
  46: {
    sourceNumber: 46,
    concept: CONCEPT_SEX_VS_GENDER,
    explanation: EXP_SEX_VS_GENDER,
    lectureReference: 'Slide(s) 5.',
  },
  47: {
    sourceNumber: 47,
    concept: CONCEPT_AFFIRMATIVE_ACTION,
    explanation: EXP_AFFIRMATIVE_ACTION,
    lectureReference: 'Slide(s) 35–39.',
  },
  48: {
    sourceNumber: 48,
    concept: CONCEPT_AFFIRMATIVE_ACTION,
    explanation: EXP_AFFIRMATIVE_ACTION,
    lectureReference: 'Slide(s) 35–39.',
    studyNote:
      "The slides list concrete direct and indirect affirmative-action measures (quotas, girls' education support, scholarships, targeted infrastructure and fee support). They do not clearly classify general gender advocacy as a specific affirmative-action measure. The keyed exception is retained from the question book.",
  },
  49: {
    sourceNumber: 49,
    concept: CONCEPT_SOCIAL_CONSTRUCTION,
    explanation: EXP_SOCIAL_CONSTRUCTION_FRAME,
    lectureReference: 'Slide(s) 5, 21–22, 25–29.',
  },
  50: {
    sourceNumber: 50,
    concept: CONCEPT_EQUALITY,
    explanation: EXP_EQUALITY,
    lectureReference: 'Slide(s) 6–7.',
  },
  51: {
    sourceNumber: 51,
    concept: CONCEPT_SOCIAL_CONSTRUCTION,
    explanation: EXP_SOCIAL_CONSTRUCTION_FRAME,
    lectureReference: 'Slide(s) 5, 21–22, 25–29.',
  },
  52: {
    sourceNumber: 52,
    concept: CONCEPT_EQUITY,
    explanation: EXP_EQUITY,
    lectureReference: 'Slide(s) 8.',
  },
  53: {
    sourceNumber: 53,
    concept: CONCEPT_DISCRIMINATION,
    explanation: EXP_DISCRIMINATION_RESPONSES,
    lectureReference: 'Slide(s) 25–29, 39–40.',
  },
  54: {
    sourceNumber: 54,
    concept: CONCEPT_SOCIAL_CONSTRUCTION,
    explanation: EXP_SOCIAL_CONSTRUCTION_FRAME,
    lectureReference: 'Slide(s) 5, 21–22, 25–29.',
  },
  55: {
    sourceNumber: 55,
    concept: CONCEPT_EQUITY,
    explanation: EXP_EQUITY,
    lectureReference: 'Slide(s) 8.',
  },
  56: {
    sourceNumber: 56,
    concept: CONCEPT_EQUALITY,
    explanation: EXP_EQUALITY,
    lectureReference: 'Slide(s) 6–7.',
  },
  57: {
    sourceNumber: 57,
    concept: CONCEPT_CIVIL_SOCIETY,
    explanation: EXP_CIVIL_SOCIETY,
    lectureReference: 'Slide(s) 30–31.',
  },
  58: {
    sourceNumber: 58,
    concept: CONCEPT_SEX_VS_GENDER,
    explanation: EXP_SEX_VS_GENDER,
    lectureReference: 'Slide(s) 5.',
  },
  59: {
    sourceNumber: 59,
    concept: CONCEPT_STEREOTYPES,
    explanation: EXP_STEREOTYPES,
    lectureReference: 'Slide(s) 4, 22.',
  },
  60: {
    sourceNumber: 60,
    concept: CONCEPT_PATRIARCHY,
    explanation: EXP_PATRIARCHY,
    lectureReference: 'Slide(s) 15–16.',
  },
  61: {
    sourceNumber: 61,
    concept: CONCEPT_MASCULINITIES,
    explanation: EXP_MASCULINITIES,
    lectureReference: 'Slide(s) 17–19.',
  },
  62: {
    sourceNumber: 62,
    concept: CONCEPT_MASCULINITIES,
    explanation: EXP_MASCULINITIES,
    lectureReference: 'Slide(s) 17–19.',
  },
  63: {
    sourceNumber: 63,
    concept: CONCEPT_MASCULINITIES,
    explanation: EXP_MASCULINITIES,
    lectureReference: 'Slide(s) 17–19.',
  },
  64: {
    sourceNumber: 64,
    concept: CONCEPT_MASCULINITIES,
    explanation: EXP_MASCULINITIES,
    lectureReference: 'Slide(s) 17–19.',
  },
  65: {
    sourceNumber: 65,
    concept: CONCEPT_SEX_VS_GENDER,
    explanation: EXP_SEX_VS_GENDER,
    lectureReference: 'Slide(s) 5.',
  },
  66: {
    sourceNumber: 66,
    concept: CONCEPT_PATRIARCHY,
    explanation: EXP_PATRIARCHY,
    lectureReference: 'Slide(s) 15–16.',
  },
  67: {
    sourceNumber: 67,
    concept: CONCEPT_SOCIAL_CONSTRUCTION,
    explanation: EXP_SOCIAL_CONSTRUCTION_FRAME,
    lectureReference: 'Slide(s) 5, 21–22, 25–29.',
  },
  68: {
    sourceNumber: 68,
    concept: CONCEPT_SOCIAL_CONSTRUCTION,
    explanation: EXP_SOCIAL_CONSTRUCTION_FRAME,
    lectureReference: 'Slide(s) 5, 21–22, 25–29.',
  },
  69: {
    sourceNumber: 69,
    concept: CONCEPT_MASCULINITIES,
    explanation: EXP_MASCULINITIES,
    lectureReference: 'Slide(s) 17–19.',
  },
  70: {
    sourceNumber: 70,
    concept: CONCEPT_GROUP_AGENCY,
    explanation: EXP_GROUP_AGENCY,
    lectureReference: 'Slide(s) 33.',
  },
  71: {
    sourceNumber: 71,
    concept: CONCEPT_PATRIARCHY,
    explanation: EXP_PATRIARCHY,
    lectureReference: 'Slide(s) 15–16.',
  },
  72: {
    sourceNumber: 72,
    concept: CONCEPT_PATRIARCHY,
    explanation: EXP_PATRIARCHY,
    lectureReference: 'Slide(s) 15–16.',
    studyNote:
      "Caution: the statement describes patriarchy as a 'natural tendency'. The slides define patriarchy as a social system with historical, social, legal, political and economic manifestations; they do not present it as biologically natural. The answer key marks True, but this wording is in tension with the lecture's social-construction framework.",
  },
  73: {
    sourceNumber: 73,
    concept: CONCEPT_EQUALITY,
    explanation: EXP_EQUALITY,
    lectureReference: 'Slide(s) 6–7.',
  },
  74: {
    sourceNumber: 74,
    concept: CONCEPT_AFFIRMATIVE_ACTION,
    explanation: EXP_AFFIRMATIVE_ACTION,
    lectureReference: 'Slide(s) 35–39.',
  },
  75: {
    sourceNumber: 75,
    concept: CONCEPT_INTERNATIONAL,
    explanation: EXP_INTERNATIONAL_RESPONSES,
    lectureReference: 'Slide(s) 26.',
  },
  76: {
    sourceNumber: 76,
    concept: CONCEPT_PATRIARCHY,
    explanation: EXP_PATRIARCHY,
    lectureReference: 'Slide(s) 15–16.',
  },
  77: {
    sourceNumber: 77,
    concept: CONCEPT_EQUALITY,
    explanation: EXP_EQUALITY,
    lectureReference: 'Slide(s) 6–7.',
  },
  78: {
    sourceNumber: 78,
    concept: CONCEPT_EQUALITY,
    explanation: EXP_EQUALITY,
    lectureReference: 'Slide(s) 6–7.',
  },
  79: {
    sourceNumber: 79,
    concept: CONCEPT_AFFIRMATIVE_ACTION,
    explanation: EXP_AFFIRMATIVE_ACTION,
    lectureReference: 'Slide(s) 35–39.',
  },
  80: {
    sourceNumber: 80,
    concept: CONCEPT_EQUITY,
    explanation: EXP_EQUITY,
    lectureReference: 'Slide(s) 8.',
  },
  81: {
    sourceNumber: 81,
    concept: CONCEPT_STATE_RESPONSES,
    explanation: EXP_STATE_RESPONSES,
    lectureReference: 'Slide(s) 27–29.',
  },
  82: {
    sourceNumber: 82,
    concept: CONCEPT_WORKPLACE_ROLES,
    explanation: EXP_WORKPLACE_ROLES,
    lectureReference: 'Slide(s) 5, 21–22.',
  },
  83: {
    sourceNumber: 83,
    concept: CONCEPT_EQUALITY,
    explanation: EXP_EQUALITY,
    lectureReference: 'Slide(s) 6–7.',
  },
  84: {
    sourceNumber: 84,
    concept: CONCEPT_ELEMENTS,
    explanation: EXP_ELEMENTS_OF_RELATIONS,
    lectureReference: 'Slide(s) 21–22.',
  },
  85: {
    sourceNumber: 85,
    concept: CONCEPT_SEX_VS_GENDER,
    explanation: EXP_SEX_VS_GENDER,
    lectureReference: 'Slide(s) 5.',
  },
  86: {
    sourceNumber: 86,
    concept: CONCEPT_MASCULINITIES,
    explanation: EXP_MASCULINITIES,
    lectureReference: 'Slide(s) 17–19.',
  },
  87: {
    sourceNumber: 87,
    concept: CONCEPT_STATE_RESPONSES,
    explanation: EXP_STATE_RESPONSES,
    lectureReference: 'Slide(s) 27–29.',
  },
  88: {
    sourceNumber: 88,
    concept: CONCEPT_SEX_VS_GENDER,
    explanation: EXP_SEX_VS_GENDER,
    lectureReference: 'Slide(s) 5.',
  },
  89: {
    sourceNumber: 89,
    concept: CONCEPT_SEX_VS_GENDER,
    explanation: EXP_SEX_VS_GENDER,
    lectureReference: 'Slide(s) 5.',
  },
  90: {
    sourceNumber: 90,
    concept: CONCEPT_SEX_VS_GENDER,
    explanation: EXP_SEX_VS_GENDER,
    lectureReference: 'Slide(s) 5.',
    studyNote:
      "The slides define group agency as collective self-conscious action that can change people's situations. They do not explicitly use the phrase 'dismantled by group agency'; the keyed answer is retained, but the explanation should be understood as an inference from the agency discussion.",
  },
  91: {
    sourceNumber: 91,
    concept: CONCEPT_SEX_VS_GENDER,
    explanation: EXP_SEX_VS_GENDER,
    lectureReference: 'Slide(s) 5.',
  },
  92: {
    sourceNumber: 92,
    concept: CONCEPT_SEX_VS_GENDER,
    explanation: EXP_SEX_VS_GENDER,
    lectureReference: 'Slide(s) 5.',
    studyNote:
      'The slides explain that gender roles are socially constructed and reinforced through socialisation. The claim that patriarchy can make socially learned roles appear natural is consistent with that discussion, but the exact statement is not stated verbatim in the slides.',
  },
  93: {
    sourceNumber: 93,
    concept: CONCEPT_SEX_VS_GENDER,
    explanation: EXP_SEX_VS_GENDER,
    lectureReference: 'Slide(s) 5.',
  },
  94: {
    sourceNumber: 94,
    concept: CONCEPT_INDIVIDUAL_AGENCY,
    explanation: EXP_INDIVIDUAL_AGENCY,
    lectureReference: 'Slide(s) 34.',
  },
  95: {
    sourceNumber: 95,
    concept: CONCEPT_SEX_VS_GENDER,
    explanation: EXP_SEX_VS_GENDER,
    lectureReference: 'Slide(s) 5.',
  },
  96: {
    sourceNumber: 96,
    concept: CONCEPT_STEREOTYPES,
    explanation: EXP_STEREOTYPES,
    lectureReference: 'Slide(s) 4, 22.',
  },
  97: {
    sourceNumber: 97,
    concept: CONCEPT_STEREOTYPES,
    explanation: EXP_STEREOTYPES,
    lectureReference: 'Slide(s) 4, 22.',
  },
  98: {
    sourceNumber: 98,
    concept: CONCEPT_EQUALITY,
    explanation: EXP_EQUALITY,
    lectureReference: 'Slide(s) 6–7.',
    studyNote:
      'The lecture defines equality as freedom to make choices without rigid stereotypes or prejudice. Compelling Akosua to pursue further education would replace one imposed expectation with another; equality protects her agency and choices rather than prescribing a single life path.',
  },
  99: {
    sourceNumber: 99,
    concept: CONCEPT_EQUITY,
    explanation: EXP_EQUITY,
    lectureReference: 'Slide(s) 8.',
    studyNote:
      "The slide's shoe-size example illustrates equity as matching support to need. However, the question's example of giving female farmers hoes and male farmers tricycles cannot be judged equitable merely from gender labels; the actual needs, work and context would have to justify the allocation. The question book marks 'No'.",
  },
  100: {
    sourceNumber: 100,
    concept: CONCEPT_SOCIAL_CONSTRUCTION,
    explanation: EXP_SOCIAL_CONSTRUCTION_FRAME,
    lectureReference: 'Slide(s) 5, 21–22, 25–29.',
  },
  101: {
    sourceNumber: 101,
    concept: CONCEPT_SOCIAL_CONSTRUCTION,
    explanation: EXP_SOCIAL_CONSTRUCTION_FRAME,
    lectureReference: 'Slide(s) 5, 21–22, 25–29.',
  },
  102: {
    sourceNumber: 102,
    concept: CONCEPT_PATRIARCHY,
    explanation: EXP_PATRIARCHY,
    lectureReference: 'Slide(s) 15–16.',
  },
  103: {
    sourceNumber: 103,
    concept: CONCEPT_PATRIARCHY,
    explanation: EXP_PATRIARCHY,
    lectureReference: 'Slide(s) 15–16.',
  },
  104: {
    sourceNumber: 104,
    concept: CONCEPT_MASCULINITIES,
    explanation: EXP_MASCULINITIES,
    lectureReference: 'Slide(s) 17–19.',
  },
  105: {
    sourceNumber: 105,
    concept: CONCEPT_SOCIAL_CONSTRUCTION,
    explanation: EXP_SOCIAL_CONSTRUCTION_FRAME,
    lectureReference: 'Slide(s) 5, 21–22, 25–29.',
  },
  106: {
    sourceNumber: 106,
    concept: CONCEPT_INTERNATIONAL,
    explanation: EXP_INTERNATIONAL_RESPONSES,
    lectureReference: 'Slide(s) 26.',
  },
  107: {
    sourceNumber: 107,
    concept: CONCEPT_SOCIAL_CONSTRUCTION,
    explanation: EXP_SOCIAL_CONSTRUCTION_FRAME,
    lectureReference: 'Slide(s) 5, 21–22, 25–29.',
  },
  108: {
    sourceNumber: 108,
    concept: CONCEPT_INTERNATIONAL,
    explanation: EXP_INTERNATIONAL_RESPONSES,
    lectureReference: 'Slide(s) 26.',
  },
  109: {
    sourceNumber: 109,
    concept: CONCEPT_MASCULINITIES,
    explanation: EXP_MASCULINITIES,
    lectureReference: 'Slide(s) 17–19.',
  },
  110: {
    sourceNumber: 110,
    concept: CONCEPT_MASCULINITIES,
    explanation: EXP_MASCULINITIES,
    lectureReference: 'Slide(s) 17–19.',
  },
  111: {
    sourceNumber: 111,
    concept: CONCEPT_SOCIAL_CONSTRUCTION,
    explanation: EXP_SOCIAL_CONSTRUCTION_FRAME,
    lectureReference: 'Slide(s) 5, 21–22, 25–29.',
  },
  112: {
    sourceNumber: 112,
    concept: CONCEPT_SOCIAL_CONSTRUCTION,
    explanation: EXP_SOCIAL_CONSTRUCTION_FRAME,
    lectureReference: 'Slide(s) 5, 21–22, 25–29.',
  },
  113: {
    sourceNumber: 113,
    concept: CONCEPT_EQUALITY,
    explanation: EXP_EQUALITY,
    lectureReference: 'Slide(s) 6–7.',
  },
  114: {
    sourceNumber: 114,
    concept: CONCEPT_STATE_RESPONSES,
    explanation: EXP_STATE_RESPONSES,
    lectureReference: 'Slide(s) 27–29.',
  },
  115: {
    sourceNumber: 115,
    concept: CONCEPT_CIVIL_SOCIETY,
    explanation: EXP_CIVIL_SOCIETY,
    lectureReference: 'Slide(s) 30–31.',
  },
  116: {
    sourceNumber: 116,
    concept: CONCEPT_SOCIAL_CONSTRUCTION,
    explanation: EXP_SOCIAL_CONSTRUCTION_FRAME,
    lectureReference: 'Slide(s) 5, 21–22, 25–29.',
  },
  117: {
    sourceNumber: 117,
    concept: CONCEPT_CIVIL_SOCIETY,
    explanation: EXP_CIVIL_SOCIETY,
    lectureReference: 'Slide(s) 30–31.',
  },
  118: {
    sourceNumber: 118,
    concept: CONCEPT_AFFIRMATIVE_ACTION,
    explanation: EXP_AFFIRMATIVE_ACTION,
    lectureReference: 'Slide(s) 35–39.',
  },
  119: {
    sourceNumber: 119,
    concept: CONCEPT_EQUALITY,
    explanation: EXP_EQUALITY,
    lectureReference: 'Slide(s) 6–7.',
  },
  120: {
    sourceNumber: 120,
    concept: CONCEPT_SOCIAL_CONSTRUCTION,
    explanation: EXP_SOCIAL_CONSTRUCTION_FRAME,
    lectureReference: 'Slide(s) 5, 21–22, 25–29.',
  },
  121: {
    sourceNumber: 121,
    concept: CONCEPT_SEX_VS_GENDER,
    explanation: EXP_SEX_VS_GENDER,
    lectureReference: 'Slide(s) 5.',
    studyNote:
      "This item makes a broad conceptual claim about sex and gender. The lecture clearly distinguishes biological sex from socially and culturally constructed gender; it does not develop the wording 'both social and natural constructs' in the same way. The question-book key is reproduced, but compare it carefully with slide 5.",
  },
  122: {
    sourceNumber: 122,
    concept: CONCEPT_EQUALITY,
    explanation: EXP_EQUALITY,
    lectureReference: 'Slide(s) 6–7.',
  },
  123: {
    sourceNumber: 123,
    concept: CONCEPT_EQUALITY,
    explanation: EXP_EQUALITY,
    lectureReference: 'Slide(s) 6–7.',
  },
  124: {
    sourceNumber: 124,
    concept: CONCEPT_EQUITY,
    explanation: EXP_EQUITY,
    lectureReference: 'Slide(s) 8.',
  },
  125: {
    sourceNumber: 125,
    concept: CONCEPT_EQUALITY,
    explanation: EXP_EQUALITY,
    lectureReference: 'Slide(s) 6–7.',
  },
  126: {
    sourceNumber: 126,
    concept: CONCEPT_EQUALITY,
    explanation: EXP_EQUALITY,
    lectureReference: 'Slide(s) 6–7.',
    studyNote:
      'The slide lists equality as considering different behaviours, aspirations and needs and valuing them equally. The wording in the question is compressed; read it as a statement about considering needs, not as saying needs are identical.',
  },
  127: {
    sourceNumber: 127,
    concept: CONCEPT_SEX_VS_GENDER,
    explanation: EXP_SEX_VS_GENDER,
    lectureReference: 'Slide(s) 5.',
  },
  128: {
    sourceNumber: 128,
    concept: CONCEPT_MASCULINITIES,
    explanation: EXP_MASCULINITIES,
    lectureReference: 'Slide(s) 17–19.',
  },
  129: {
    sourceNumber: 129,
    concept: CONCEPT_AFFIRMATIVE_ACTION,
    explanation: EXP_AFFIRMATIVE_ACTION,
    lectureReference: 'Slide(s) 35–39.',
  },
  130: {
    sourceNumber: 130,
    concept: CONCEPT_DIVISION_OF_LABOUR,
    explanation: EXP_PRODUCTIVE_REPRODUCTIVE,
    lectureReference: 'Slide(s) 21.',
  },
  131: {
    sourceNumber: 131,
    concept: CONCEPT_DIVISION_OF_LABOUR,
    explanation: EXP_PRODUCTIVE_REPRODUCTIVE,
    lectureReference: 'Slide(s) 21.',
  },
  132: {
    sourceNumber: 132,
    concept: CONCEPT_EQUALITY,
    explanation: EXP_EQUALITY,
    lectureReference: 'Slide(s) 6–7.',
  },
  133: {
    sourceNumber: 133,
    concept: CONCEPT_DIVISION_OF_LABOUR,
    explanation: EXP_PRODUCTIVE_REPRODUCTIVE,
    lectureReference: 'Slide(s) 21.',
  },
  134: {
    sourceNumber: 134,
    concept: CONCEPT_STATE_RESPONSES,
    explanation: EXP_STATE_RESPONSES,
    lectureReference: 'Slide(s) 27–29.',
  },
  135: {
    sourceNumber: 135,
    concept: CONCEPT_STATE_RESPONSES,
    explanation: EXP_STATE_RESPONSES,
    lectureReference: 'Slide(s) 27–29.',
  },
  136: {
    sourceNumber: 136,
    concept: CONCEPT_STATE_RESPONSES,
    explanation: EXP_STATE_RESPONSES,
    lectureReference: 'Slide(s) 27–29.',
  },
  137: {
    sourceNumber: 137,
    concept: CONCEPT_STATE_RESPONSES,
    explanation: EXP_STATE_RESPONSES,
    lectureReference: 'Slide(s) 27–29.',
  },
  138: {
    sourceNumber: 138,
    concept: CONCEPT_CIVIL_SOCIETY,
    explanation: EXP_CIVIL_SOCIETY,
    lectureReference: 'Slide(s) 30–31.',
  },
  139: {
    sourceNumber: 139,
    concept: CONCEPT_AFFIRMATIVE_ACTION,
    explanation: EXP_AFFIRMATIVE_ACTION,
    lectureReference: 'Slide(s) 35–39.',
    studyNote:
      "The slide defines affirmative action as measures addressing systemic discrimination and exclusion and says it encourages efforts of particular social groups for development goals. The question's phrase 'all social groups' is broader than the slide wording; the key is retained from the question book.",
  },
  140: {
    sourceNumber: 140,
    concept: CONCEPT_AFFIRMATIVE_ACTION,
    explanation: EXP_AFFIRMATIVE_ACTION,
    lectureReference: 'Slide(s) 35–39.',
  },
  141: {
    sourceNumber: 141,
    concept: CONCEPT_EQUITY,
    explanation: EXP_EQUITY,
    lectureReference: 'Slide(s) 8.',
  },
  142: {
    sourceNumber: 142,
    concept: CONCEPT_STEREOTYPES,
    explanation: EXP_STEREOTYPES,
    lectureReference: 'Slide(s) 4, 22.',
  },
  143: {
    sourceNumber: 143,
    concept: CONCEPT_AFFIRMATIVE_ACTION,
    explanation: EXP_AFFIRMATIVE_ACTION,
    lectureReference: 'Slide(s) 35–39.',
  },
  144: {
    sourceNumber: 144,
    concept: CONCEPT_SEX_VS_GENDER,
    explanation: EXP_SEX_VS_GENDER,
    lectureReference: 'Slide(s) 5.',
  },
  145: {
    sourceNumber: 145,
    concept: CONCEPT_DIVISION_OF_LABOUR,
    explanation: EXP_PRODUCTIVE_REPRODUCTIVE,
    lectureReference: 'Slide(s) 21.',
  },
  146: {
    sourceNumber: 146,
    concept: CONCEPT_PATRIARCHY,
    explanation: EXP_PATRIARCHY,
    lectureReference: 'Slide(s) 15–16.',
  },
  147: {
    sourceNumber: 147,
    concept: CONCEPT_SOCIALISATION,
    explanation: EXP_SOCIALISATION_CULTURE,
    lectureReference: 'Slide(s) 11–12.',
  },
  148: {
    sourceNumber: 148,
    concept: CONCEPT_SOCIALISATION,
    explanation: EXP_SOCIALISATION_CULTURE,
    lectureReference: 'Slide(s) 11–12.',
  },
  149: {
    sourceNumber: 149,
    concept: CONCEPT_MASCULINITIES,
    explanation: EXP_MASCULINITIES,
    lectureReference: 'Slide(s) 17–19.',
  },
  150: {
    sourceNumber: 150,
    concept: CONCEPT_DISCRIMINATION,
    explanation: EXP_DISCRIMINATION_RESPONSES,
    lectureReference: 'Slide(s) 25–29, 39–40.',
  },
  151: {
    sourceNumber: 151,
    concept: CONCEPT_INDIVIDUAL_AGENCY,
    explanation: EXP_INDIVIDUAL_AGENCY,
    lectureReference: 'Slide(s) 34.',
  },
  152: {
    sourceNumber: 152,
    concept: CONCEPT_INDIVIDUAL_AGENCY,
    explanation: EXP_INDIVIDUAL_AGENCY,
    lectureReference: 'Slide(s) 34.',
  },
  153: {
    sourceNumber: 153,
    concept: CONCEPT_INDIVIDUAL_AGENCY,
    explanation: EXP_INDIVIDUAL_AGENCY,
    lectureReference: 'Slide(s) 34.',
  },
  154: {
    sourceNumber: 154,
    concept: CONCEPT_INDIVIDUAL_AGENCY,
    explanation: EXP_INDIVIDUAL_AGENCY,
    lectureReference: 'Slide(s) 34.',
  },
  155: {
    sourceNumber: 155,
    concept: CONCEPT_DIVISION_OF_LABOUR,
    explanation: EXP_PRODUCTIVE_REPRODUCTIVE,
    lectureReference: 'Slide(s) 21.',
  },
  156: {
    sourceNumber: 156,
    concept: CONCEPT_STEREOTYPES,
    explanation: EXP_STEREOTYPES,
    lectureReference: 'Slide(s) 4, 22.',
  },
  157: {
    sourceNumber: 157,
    concept: CONCEPT_MASCULINITIES,
    explanation: EXP_MASCULINITIES,
    lectureReference: 'Slide(s) 17–19.',
  },
  158: {
    sourceNumber: 158,
    concept: CONCEPT_PATRIARCHY,
    explanation: EXP_PATRIARCHY,
    lectureReference: 'Slide(s) 15–16.',
  },
};

/**
 * Returns a brief, source-supported reason why a student's incorrect selection
 * does not fit, strictly grounded in the lecture explanation guide without inventing claims.
 */
export function getIncorrectSelectionReason(
  questionText: string,
  chosenOptionText: string,
  correctAnswerText: string,
  explanation?: GenderQuestionExplanation
): string | null {
  if (!explanation) return null;

  const qLower = questionText.toLowerCase();
  const chosenLower = chosenOptionText.trim().toLowerCase();
  const correctLower = correctAnswerText.trim().toLowerCase();

  // Yes/No & True/False questions
  if (
    chosenLower === 'true' ||
    chosenLower === 'false' ||
    chosenLower === 'yes' ||
    chosenLower === 'no'
  ) {
    if (explanation.studyNote) {
      return `Selecting "${chosenOptionText}" conflicts with the lecture guide's note: ${explanation.studyNote}`;
    }
    return `Selecting "${chosenOptionText}" does not match the lecture slides' position on ${explanation.concept.toLowerCase()}; the keyed answer is "${correctAnswerText}".`;
  }

  // "Except" questions where distractors belong to the stated category
  if (/\bexcept\b/.test(qLower)) {
    return `"${chosenOptionText}" is one of the valid items/examples included within this lecture category (${explanation.lectureReference}), whereas the question asks for the exception ("${correctAnswerText}").`;
  }

  // Specific conceptual contrasts grounded directly in the lecture slides
  if (
    explanation.concept === CONCEPT_SEX_VS_GENDER &&
    (chosenLower.includes('natural') || chosenLower.includes('human') || chosenLower === 'sex')
  ) {
    return `"${chosenOptionText}" points to a natural/biological framing, whereas Slide 5 defines gender as socially and culturally constructed rather than biological.`;
  }

  if (
    explanation.concept === CONCEPT_EQUITY &&
    (chosenLower.includes('equal') || chosenLower === 'balanced') &&
    correctLower.includes('equit')
  ) {
    return `"${chosenOptionText}" refers to identical or balanced treatment, whereas gender equity (Slide 8) specifically means fairness tailored to respective needs.`;
  }

  if (
    explanation.concept === CONCEPT_EQUALITY &&
    chosenLower.includes('equity') &&
    correctLower.includes('equality')
  ) {
    return `"${chosenOptionText}" focuses on need-based fairness, whereas Slides 6–7 define gender equality as equal freedom, rights, and opportunities regardless of gender.`;
  }

  if (
    explanation.concept === CONCEPT_CIVIL_SOCIETY &&
    (chosenLower === 'legal' || chosenLower.includes('state'))
  ) {
    return `"${chosenOptionText}" describes state action, whereas Slides 30–31 classify labour unions and professional associations as civil-society actions between families and the state.`;
  }

  return `"${chosenOptionText}" does not align with the lecture concept (${explanation.concept}) cited in ${explanation.lectureReference}; "${correctAnswerText}" is the keyed match.`;
}
