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
