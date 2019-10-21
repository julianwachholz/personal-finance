from django.urls import reverse_lazy
from django.views.generic import FormView

from .forms import TaxForm


class TaxFormView(FormView):
    form_class = TaxForm
    template_name = "taxdata/form.html"
    success_url = reverse_lazy("tax_form")


tax_form = TaxFormView.as_view()
