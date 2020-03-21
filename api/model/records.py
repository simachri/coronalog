from firebase_admin import firestore


def get_timestamp():
    """Returns a server timestamp."""
    return firestore.firestore.SERVER_TIMESTAMP


class Records:
    """Registration of a person to an event"""

    def __init__(self, from_json: dict = None, user=None, date=None, cough_intensity=None, cough_type=None, breathlessness=None, fatigued=None,
                 limb_pain=None, sniffles=None, sore_throat=None, fever=None, diarrhoea=None):
        """Creates a registration object instance.

        :param from_json: JSON data for all the attributes. All other explicitly provided parameters values take
        precedence over the values provided in from_json. :param event_name: :param first_name: :param last_name:
        :param birthday: :param street_w_house_no: :param zip_code: :param city: :param comment: :param created_at:
        """
        #self.user = user
        #self.date = date
        #TODO User erstellen
        self.cough_intensity = cough_intensity
        self.cough_type = cough_type
        self.breathlessness = breathlessness
        self.fatigued = fatigued
        self.limb_pain = limb_pain
        self.sniffles = sniffles
        self.sore_throat = sore_throat
        self.fever = fever
        self.diarrhoea = diarrhoea
        if date is None:
            self.date = get_timestamp()

    def to_json(self):
        """Converts the object instance to JSON."""
        return vars(self)
