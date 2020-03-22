from firebase_admin import firestore


def get_timestamp():
    """Returns a server timestamp."""
    return firestore.firestore.SERVER_TIMESTAMP


class Anamnese:
    """Anamnese record"""

    def __init__(self, from_json=None,
                 gender=None,
                 residence=None,
                 birthyear=None,
                 smoker=None,
                 pregnant=None,
                 positive_tested=None,
                 infection_contact=None,
                 risk_area_stay=None,
                 medication=None,
                 cardiovascular_desease=None,
                 pulmonary_problems=None,
                 chronic_liver_disease=None,
                 diabetes_mellitus=None,
                 cancer=None,
                 immunodeficiency=None,
                 miscellaneous=None):

        """Creates an anamnese object instance.
        """
        if gender is not None:
            self.gender = gender
        if residence is not None:
            self.residence = residence
        if birthyear is not None:
            self.birthyear = birthyear
        if smoker is not None:
            self.smoker = smoker
        if pregnant is not None:
            self.pregnant = pregnant
        if positive_tested is not None:
            self.positive_tested = positive_tested
        if infection_contact is not None:
            self.infection_contact = infection_contact
        if risk_area_stay is not None:
            self.risk_area_stay = risk_area_stay
        if medication is not None:
            self.medication = medication
        if cardiovascular_desease is not None:
            self.cardiovascular_desease = cardiovascular_desease
        if pulmonary_problems is not None:
            self.pulmonary_problems = pulmonary_problems
        if chronic_liver_disease is not None:
            self.chronic_liver_disease = chronic_liver_disease
        if diabetes_mellitus is not None:
            self.diabetes_mellitus = diabetes_mellitus
        if cancer is not None:
            self.cancer = cancer
        if immunodeficiency is not None:
            self.immunodeficiency = immunodeficiency
        if miscellaneous is not None:
            self.miscellaneous = miscellaneous
        self.changed_at = get_timestamp()
        if from_json is not None:
            # Set emptry attributes from provided JSON.
            for name, value in from_json.items():
                if getattr(self, name) is None:
                    setattr(self, name, value)

    def to_json(self):
        """Converts the object instance to JSON."""
        return vars(self)

    def enhance_values(self, anamnese):
        for name, value in anamnese.items():
            if getattr(self, name) is None:
                setattr(self, name, value)
        return self
