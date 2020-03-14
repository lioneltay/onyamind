SERVICE=default
# +1 accounts for tail behaviour
VERSIONS_TO_KEEP=$((3 + 1))
VERSIONS=$(gcloud app versions list --service $SERVICE --sort-by '~versions' --format 'value(version.id)' | sort -r | tail -n +$VERSIONS_TO_KEEP | paste -sd " " -)

if [ ${#VERSIONS} -gt 0 ]
then
    # If you want to confirm before deletion, remove the -q
    gcloud app versions delete --service $SERVICE $(echo $VERSIONS) -q
fi