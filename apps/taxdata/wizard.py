import data_wizard

from .models import TaxBase, TaxRate

data_wizard.register(TaxRate)
data_wizard.register(TaxBase)
