import db


class Registration:
    """Registration of a person to an event"""

    def __init__(self, from_json: dict = None, event_name=None, first_name=None, last_name=None, birthday=None,
                 street_w_house_no=None,
                 zip_code=None, city=None, comment=None,
                 created_at=None):
        """Creates a registration object instance.

        :param from_json: JSON data for all the attributes. All other explicitly provided parameters values take
        precedence over the values provided in from_json. :param event_name: :param first_name: :param last_name:
        :param birthday: :param street_w_house_no: :param zip_code: :param city: :param comment: :param created_at:
        """
        self.comment = comment
        self.city = city
        self.zip_code = zip_code
        self.street_w_house_no = street_w_house_no
        self.birthday = birthday
        self.last_name = last_name
        self.first_name = first_name
        self.event_name = event_name
        self.created_at = created_at
        if created_at is None:
            self.created_at = db.get_timestamp()
        if from_json is not None:
            # Set emptry attributes from provided JSON.
            for name, value in from_json.items():
                if getattr(self, name) is None:
                    setattr(self, name, value)

    def to_json(self):
        """Converts the object instance to JSON."""
        return vars(self)
