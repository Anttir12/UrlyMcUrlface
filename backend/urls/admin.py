from django.contrib import admin

from urls.models import Urly, UrlyVisit


class UrlyAdmin(admin.ModelAdmin):
    pass

class UrlyVisitAdmin(admin.ModelAdmin):
    pass


admin.site.register(Urly, UrlyAdmin)
admin.site.register(UrlyVisit, UrlyVisitAdmin)
