from typing import Dict, Any

from firebase_admin import firestore


def get_timestamp():
    """Returns a server timestamp."""
    return firestore.firestore.SERVER_TIMESTAMP


class Record:
    """Registration of a person to an event"""

    def __init__(self, from_json: dict = None, date=None, cough_intensity=None, cough_type=None, cough_color=None,
                 breathlessness=None,
                 fatigued=None,
                 limb_pain=None, sniffles=None, sore_throat=None, fever=None, diarrhoea=None):
        """Creates a registration object instance.

        :param from_json: JSON data for all the attributes. All other explicitly provided parameters values take
        precedence over the values provided in from_json.
        """
        # Date is mandatory but it can be provided by from_json
        self.date = date
        if cough_intensity is not None:
            self.cough_intensity = cough_intensity
        if cough_type is not None:
            self.cough_type = cough_type
        if cough_color is not None:
            self.cough_color = cough_color
        if breathlessness is not None:
            self.breathlessness = breathlessness
        if fatigued is not None:
            self.fatigued = fatigued
        if limb_pain is not None:
            self.limb_pain = limb_pain
        if sniffles is not None:
            self.sniffles = sniffles
        if sore_throat is not None:
            self.sore_throat = sore_throat
        if fever is not None:
            self.fever = fever
        if diarrhoea is not None:
            self.diarrhoea = diarrhoea
        if from_json is not None:
            # Set emptry attributes from provided JSON.
            for name, value in from_json.items():
                if getattr(self, name, None) is None:
                    setattr(self, name, value)

    def to_json(self):
        """Converts the object instance to JSON."""
        return vars(self)

    def get_symptoms(self) -> Dict[str, Any]:
        json = self.to_json()
        json.pop('date')
        return json
