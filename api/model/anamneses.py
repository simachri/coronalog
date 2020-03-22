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
        self.gender = gender
        self.residence = residence
        self.birthyear = birthyear
        self.smoker = smoker
        self.pregnant = pregnant
        self.positive_tested = positive_tested
        self.infection_contact = infection_contact
        self.risk_area_stay = risk_area_stay
        self.medication = medication
        self.cardiovascular_desease = cardiovascular_desease
        self.pulmonary_problems = pulmonary_problems
        self.chronic_liver_disease = chronic_liver_disease
        self.diabetes_mellitus = diabetes_mellitus
        self.cancer = cancer
        self.immunodeficiency = immunodeficiency
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
