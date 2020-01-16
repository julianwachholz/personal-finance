from collections import OrderedDict

from rest_framework import serializers


class UserPKField(serializers.PrimaryKeyRelatedField):
    """
    PK field that filters the queryset by the current user.

    """

    def get_queryset(self):
        request = self.context.get("request", None)
        queryset = super().get_queryset()
        if not request:
            raise Exception("no request")
            return queryset.none()
        return queryset.filter(user=request.user)


class PKWithLabelField(serializers.RelatedField):
    """
    Read-write field for primary keys.

    Returns a key-value dict on reads and
    accepts a primary-key only when writing.

    """

    def __init__(self, **kwargs):
        self.extra = kwargs.pop("extra", [])
        super().__init__(**kwargs)

    def use_pk_only_optimization(self):
        # we need the full object for the __str__ method
        return False

    def to_representation(self, obj):
        """Show a nice key + value dict instead of just the ID."""
        rep = {"value": obj.pk, "label": str(obj)}
        for field in self.extra:
            rep[field] = getattr(obj, field)
        return rep

    def to_internal_value(self, data):
        if isinstance(data, dict):
            data = data["value"]
        return super().to_internal_value(data)

    def get_choices(self, cutoff=None):
        queryset = self.get_queryset()
        if queryset is None:
            return {}

        if cutoff is not None:
            queryset = queryset[:cutoff]

        # Choices should not use to_representation
        return OrderedDict([(item.pk, self.display_value(item)) for item in queryset])


class UserPKWithLabelField(PKWithLabelField, UserPKField):
    pass
