from rest_framework.pagination import PageNumberPagination


class ControllablePageNumberPagination(PageNumberPagination):
    page_size_query_param = "page_size"
    page_size = 10
    max_page_size = 250

    def get_next_link(self):
        if not self.page.has_next():
            return None
        return self.page.next_page_number()

    def get_previous_link(self):
        if not self.page.has_previous():
            return None
        return self.page.previous_page_number()
