Feature: Check24 Main Page

  Scenario: Search for Product
    Given I open Check24 page
    When I search for "PS5"
    Then I am on product result page

  Scenario: Search for Product wp
    Given I open Check24 page wp
    When I search for "PS5" wp
    Then I am on product result page wp
