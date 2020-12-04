# Data- Size Reduction

## gender_file_split.js

-   Separate files for males and females
-   before:24.473867416381836Mb  after:22.57689380645752Mb  difference:1.8969736099243164Mb

## letter_objects.js

-   Letter Files
-   Object with name keys that point to arrays of counts
    A.json -> {
      "years"=[1881, 1882,..,2019],
      "male"={
        "andrew":[5, 5, 0, ..., 567]
      },
      "female"={
        "agnes":[50, 50, 0, ..., 5]
      }
    }

## TO-DO

-   Tests to compare original with clean
