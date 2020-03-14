VERSIONS=$(gcloud app versions list --service client-dev --sort-by '~versions' --format 'value(version.id)' | sort -r | tail -n +3 | paste -sd " " -)

gcloud app versions list --service client-dev

# if [ ${#VERSIONS} -gt 0 ]
# then
#     # If you want to confirm before deletion, remove the -q
#     gcloud app versions delete --service client-dev $(echo $VERSIONS) -q
# fi